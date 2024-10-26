from django.conf import settings

from rest_framework.permissions import DjangoModelPermissions

from main.cognito import check_cognito_user
from main.utils import MutationOutput, Messages

from strawberry.types.info import Info
from strawberry_django.permissions import DjangoPermissionExtension, _desc
from strawberry_django.resolvers import django_resolver
from strawberry_django.utils.typing import UserType

from typing import Optional, ClassVar, Callable, Any


class GershadAPIPermission(DjangoModelPermissions):
    """
    Define permissions to access based on Cognito IDs
    as well as Bearer Tokens. When Cognito ID is empty
    the Bearer Token will be used.
    """
    def has_permission(self, request, view):
        token = None
        if request.method == 'GET':
            return True
        else:
            token = request.data.get('token', None)

        if None in [settings.COGNITO_POOL_REGION, settings.COGNITO_POOL_ID]:
            assert(False)

        if token and token.split(':')[0] == settings.COGNITO_POOL_REGION:
            return check_cognito_user(token)

        return super().has_permission(request, view)


class GershadAPIAdminPermission(DjangoModelPermissions):
    """
    Define permissions to access based on Cognito IDs
    as well as Bearer Tokens. When Cognito ID is empty
    the Bearer Token will be used.
    """
    def has_permission(self, request, view):
        if request.method == 'GET':
            return True

        return super().has_permission(request, view)


class CheckCognitoUserMutationExtension(DjangoPermissionExtension):
    """
        Mark a field as only resolvable by valid tokens. (For Mutations)
    """

    DEFAULT_ERROR_MESSAGE: ClassVar[str] = "Invalid token"
    SCHEMA_DIRECTIVE_DESCRIPTION: ClassVar[Optional[str]] = _desc(
        "Can only be resolved by valid tokens.",
    )

    @django_resolver(qs_hook=None)
    def resolve_for_user(
        self,
        resolver: Callable,
        user: Optional[UserType],
        *,
        info: Info,
        source: Any,
    ):

        if settings.BUILD_ENV == 'local':
            return resolver()

        token = resolver.keywords['token']
        if token and token.split(':')[0] == settings.COGNITO_POOL_REGION:
            if check_cognito_user(token):
                return resolver()

        return MutationOutput(
            success=False,
            errors=Messages.INVALID_TOKEN)
