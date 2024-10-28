import { PageComponent } from "src/utils/createLocalePageComponent";

// Placeholder page to avoid build errors — won’t ever be rendered (unless we
// want to deploy to S3 and map the 404 page)
const NotFoundPage: PageComponent = () => {
  return <></>;
};

export default NotFoundPage;
