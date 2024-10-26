import inspect
from typing import (
    Any, Optional, NewType, cast)

import strawberry
from strawberry.relay.types import NodeIterableType
from strawberry.relay.utils import from_base64, to_base64
from strawberry.types.info import Info
from strawberry.utils.await_maybe import AwaitableOrValue
from strawberry_django import relay
from typing_extensions import Self


def redact_data(data):
    data.pop('address', None)
    data.pop('latitude', None)
    data.pop('longitude', None)
    return data


def update_data_if_changed(newval, instance, property):
    prop = newval.get(property, getattr(instance, property))
    if getattr(instance, property) != prop:
        setattr(instance, property, prop)
        return True
    return False


def serialize_excpected_error(errors):
    """
    Serialize mutation errors
    """
    if isinstance(errors, dict):
        if errors.get("__all__", False):
            errors["non_field_errors"] = errors.pop("__all__")
        return errors
    elif isinstance(errors, list):
        return {"nonFieldErrors": errors}


ErrorType = strawberry.scalar(
    NewType("ExpectedError", dict),
    description="""
    Mutation Errors messages and codes mapped to
    fields or non fields errors.
    Example:
    {
        field_name: [
            {
                "message": "error message",
                "code": "error_code"
            }
        ],
        other_field: [
            {
                "message": "error message",
                "code": "error_code"
            }
        ],
        nonFieldErrors: [
            {
                "message": "error message",
                "code": "error_code"
            }
        ]
    }
    """,
    serialize=lambda value: serialize_excpected_error(value),
    parse_value=lambda value: value,
)


@strawberry.type
class MutationOutput:
    """
    A type that represents the output of a mutation
    """
    success: bool
    errors: Optional[ErrorType] = None


class Messages:
    """
    Messages and codes for mutation errors
    """
    POI_NOT_FOUND = [{'message': 'Unable to find point of interest', 'code': 'poi_not_found'}]
    REPORT_NOT_FOUND = [{'message': 'Unable to find report', 'code': 'report_not_found'}]
    TOO_MANY_REPORTS = [{'message': 'Too many reports', 'code': 'too_many_reports'}]
    UNKNOWN_REPORT_TYPE = [{'message': 'Unknown report type', 'code': 'unknown_report_type'}]
    INVALID_LOCATION = [{'message': 'Invalid latitude, longitude value', 'code': 'invalid_location_params'}]
    INVALID_TOKEN = [{'message': 'Invalid token', 'code': 'invalid_token'}]


@strawberry.type
class Connection(relay.ListConnectionWithTotalCount[strawberry.relay.NodeType]):
    """
    A strawberry connection to count the number of query results
    """

    @strawberry.field
    def edge_count(root, info: Info) -> Optional[int]:
        return len(root.edges)

    # Adding offset argument to custom connection
    @classmethod
    def resolve_connection(
        cls,
        nodes: NodeIterableType[strawberry.relay.NodeType],
        *,
        info: Info,
        before: Optional[str] = None,
        after: Optional[str] = None,
        first: Optional[int] = None,
        last: Optional[int] = None,
        offset: Optional[int] = None,
        **kwargs: Any,
    ) -> AwaitableOrValue[Self]:

        # This implemntation is based on the graphene
        # implementation of first/offset pagination
        if offset:
            if after:
                offset += from_base64(after) + 1
            # input offset starts at 1 while the offset starts at 0
            after = to_base64("arrayconnection", offset - 1)

        conn = super().resolve_connection(
            nodes,
            info=info,
            before=before,
            after=after,
            first=first,
            last=last,
            **kwargs,
        )

        if inspect.isawaitable(conn):

            async def wrapper():
                resolved = await conn
                resolved.nodes = nodes
                return resolved

            return wrapper()

        conn = cast(Self, conn)
        conn.nodes = nodes
        return conn
