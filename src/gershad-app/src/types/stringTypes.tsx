import { BackgroundGeolocationDisabledNoticeStrings } from "src/components/BackgroundGeolocationDisabledNotice";
import { ClientSideErrorFallbackStrings } from "src/components/ClientSideErrorFallback";
import { DeleteAndUpdateConfirmationDialogStrings } from "src/components/DeleteAndUpdateConfirmationDialog";
import { ErrorMessageDialogStrings } from "src/components/ErrorMessageDialog";
import { FormSubmitButtonWithLoadingIndicatorStrings } from "src/components/form/FormSubmitButtonWithLoadingIndicator";
import { UserReportCommentsFormStrings } from "src/components/form/UserReportCommentsForm";
import { GoogleMapsApiLoadingLogicStrings } from "src/components/GoogleMapsApiLoadingLogic";
import { GoogleMapStrings } from "src/components/HomePage/GoogleMap/GoogleMap";
import { HotzoneMarkerStrings } from "src/components/HomePage/GoogleMap/HotZone/HotzoneMarker";
import { ReportOverlayReportLocationButtonStrings } from "src/components/HomePage/ReportOverlay/ReportOverlayReportLocationButton";
import { ReportErrorMessageDialogStrings } from "src/components/HomePage/ReportOverlay/ReportTypeSelection/ReportErrorMessageDialog";
import { ReportTypeSelectionStrings } from "src/components/HomePage/ReportOverlay/ReportTypeSelection/ReportTypeSelection";
import { ReportActionDeleteButtonStrings } from "src/components/HomePage/ReportOverlay/UserReportGroupDialog/ReportActions/ReportActionDeleteButton";
import { ReportDescriptionOverlayStrings } from "src/components/HomePage/ReportOverlay/UserReportGroupDialog/ReportDescriptionOverlay";
import { UserReportGroupMembersStrings } from "src/components/HomePage/ReportOverlay/UserReportGroupDialog/UserReportGroupMembers";
import { UserReportGroupMinimalStrings } from "src/components/HomePage/ReportOverlay/UserReportGroupDialog/UserReportGroupMinimal";
import { HomePageSearchNavStrings } from "src/components/HomePageSearchNav";
import { FootnotesListStrings } from "src/components/KnowYourRightsPage/FootnotesList";
import { SearchBoxStrings } from "src/components/KnowYourRightsPage/SearchBox";
import { MenuDrawerStrings } from "src/components/MenuDrawer/MenuDrawer";
import { OnboardingCarouselStrings } from "src/components/OnboardingCarousel/OnboardingCarousel";
import { PageMetaStrings } from "src/components/PageMeta";
import { AddPointsOfInterestFabStrings } from "src/components/PointsOfInterestPage/AddPointsOfInterestFab";
import { PointOfInterestListItemStrings } from "src/components/PointsOfInterestPage/PointOfInterestListItem";
import { NotificationsPermissionSettingsListStrings } from "src/components/SettingsPage/NotificationsSection/NotificationsPermissionSettingsList";
import { NotificationsPrerequisitesNoticeStrings } from "src/components/SettingsPage/NotificationsSection/NotificationsPrerequisitesNotice";
import { NotificationsPrerequisitesNoticeFunctionalityExplanationStrings } from "src/components/SettingsPage/NotificationsSection/NotificationsPrerequisitesNoticeFunctionalityExplanation";
import { NotificationsPrerequisitesNoticeListItemStrings } from "src/components/SettingsPage/NotificationsSection/NotificationsPrerequisitesNoticePermissionsListItem";
import { P2PSettingSectionStrings } from "src/components/SettingsPage/P2PSettingSection";
import { UninstallApplicationSectionStrings } from "src/components/SettingsPage/UninstallApplicationSection";
import { AboutPageStrings } from "src/pageComponents/AboutPage";
import { KnowYourRightsPageStrings } from "src/pageComponents/KnowYourRights/KnowYourRightsPage";
import { KnowYourRightsSearchPageStrings } from "src/pageComponents/KnowYourRights/KnowYourRightsSearchPage";
import { PointsOfInterestPageStrings } from "src/pageComponents/PointsOfInterestPage";
import { ReportsPageStrings } from "src/pageComponents/ReportsPage";
import { SettingsPageStrings } from "src/pageComponents/SettingsPage";
import { UserGuidePageStrings } from "src/pageComponents/UserGuidePage";

type NotificationText = {
  /**
   * Notification body text.
   */
  description: string;
  /**
   * Notification title.
   */
  title: string;
};

// !!! This must be exported for compatibility with ts-json-schema-generator !!!
export type SharedStrings = {
  /**
   * Text for code that manages tracking the user’s location in the background.
   */
  backgroundGeoLocation: {
    /**
     * Explanations for requested permissions (displayed in permission dialogs).
     *
     * NOTE: If the app is functioning correctly these should never appear since
     * we check to see if the user has granted this permission before calling
     * the method that triggers this popup, but we need to provide this in case
     * there’s a bug that allows it to appear.
     */
    backgroundPermissionRationale: {
      message: string;
      negativeAction: string;
      positiveAction: string;
      title: string;
    };
    /**
     * Text for persistent Android notification indicating to the user that
     * background tracking is active.
     */
    notification: {
      text: string;
      title: string;
    };
  };
  /**
   * Text for beepass Logo description
   */
  beepassDescription: string;

  /**
   * Share Button Text
   */
  button: {
    all: string;
    bookmark: string;
    bookmarkThisLocation: string;
    bookmarked: string;
    confirm: string;
    delete: string;
    edit: string;
    goBack: string;
    iUnderstand: string;
    no: string;
    save: string;
    share: string;
    submit: string;
    yes: string;
  };

  /**
   * Notifications
   */
  notifications: {
    /**
     * Notification that appears when the user’s device enters a hot zone.
     */
    hotZoneEntered: NotificationText;
    /**
     * Notification that appears when there’s one or more new reports near the
     * user’s device.
     */
    newReportsNearDevice: NotificationText;
    /**
     * Notification that appears when there’s one or more new reports near a
     * location the user has bookmarked (a.k.a. a "point of interest")
     */
    newReportsNearPoi: NotificationText;
  };

  /**
   * Report Types
   */
  reportTypes: {
    /**
     * The text 'All' used in report filtering options.
     * It indicates that it will display all available report types
     */
    all: string;
    /**
     * Text `Permanent` specifies the report types
     */
    permanent: string;
    /**
     * Text `Police` specifies the report types
     */
    police: string;
    /**
     * Text "Repressive force" ("Anti-protest") specifies the report types
     */
    repForce: string;
    /**
     * Text `Stop Check` specifies the report types
     */
    stopCheck: string;
    /**
     * Text `Van` specifies the report types
     */
    van: string;
  };

  /**
   * Site title (reused where appropriate)
   */
  siteTitle: string;

  /**
   * Text for switch state label
   */
  switchLabel: {
    off: string;
    on: string;
  };

  /**
   * Text for various toasts (success/warning/error messages that pop up at the
   * bottom of the screen).
   */
  toasts: {
    bookmarkAddFailed: string;
    bookmarkAddPreventedDuplicate: string;
    bookmarkAddSucceeded: string;
    bookmarkDeleteFailed: string;
    bookmarkDeleteSucceeded: string;
    commentEditFailed: string;
    commentEditSucceeded: string;
    /**
     * Used in cases where the app fails to load data (reports, user reports,
     * hotzones, pages, etc.)
     */
    dataLoadFailed: string;
    reportAddFailed: string;
    /**
     * Message that appears if the server rejects a new report (or report
     * confirmation) because the user has created a report in the past 30
     * minutes.
     */
    reportAddRejectedTooManyReports: string;
    reportAddSucceeded: string;
    reportDeleteFailed: string;
    reportDeleteSucceeded: string;
  };
};

export type Strings = {
  $schema: string;

  /**
   * About page .
   */
  AboutPage: AboutPageStrings;

  /**
   * PointsOfInterest locations page (+) button.
   */
  AddPointsOfInterestFab: AddPointsOfInterestFabStrings;

  /**
   * Notice to display if background geolocation is disabled (so notifications
   * can’t be sent).
   *
   * Displayed in bookmarked locations page if background geolocation is
   * disabled.
   */
  BackgroundGeolocationDisabledNotice: BackgroundGeolocationDisabledNoticeStrings;

  /**
   * Error displayed if the site fails in the browser (e.g. because the user is
   * using a very old browser, or there’s a frontend bug).
   */
  ClientSideErrorFallback: ClientSideErrorFallbackStrings;

  /**
   * Confirmation dialog for deleting items (bookmarks, reports, etc.) and updating app version.
   */
  DeleteAndUpdateConfirmationDialog: DeleteAndUpdateConfirmationDialogStrings;

  /**
   * ErrorMessageDialog
   */
  ErrorMessageDialog: ErrorMessageDialogStrings;

  /**
   * KnowYourRightsChildPageContent - FootnotesList
   */
  FootnotesList: FootnotesListStrings;
  /**
   * For submit button that displays a loading indicator while the form is
   * submitting.
   */
  FormSubmitButtonWithLoadingIndicator: FormSubmitButtonWithLoadingIndicatorStrings;

  /**
   * Google Map main logic.
   */
  GoogleMap: GoogleMapStrings;

  /**
   * Internal loading/error handling logic for Google Maps API.
   */
  GoogleMapsApiLoadingLogic: GoogleMapsApiLoadingLogicStrings;

  /**
   * Home page fixed search/nav box.
   */
  HomePageSearchNav: HomePageSearchNavStrings;

  /**
   * HomePage - Hotzone Marker
   */
  HotzoneMarker: HotzoneMarkerStrings;

  /**
   * Know Your Rights Page
   */
  KnowYourRightsPage: KnowYourRightsPageStrings;

  /**
   * Know Your RightsSearchPage
   */
  KnowYourRightsSearchPage: KnowYourRightsSearchPageStrings;

  /**
   * Navigation menu drawer.
   */
  MenuDrawer: MenuDrawerStrings;

  /**
   * SettingsPage - NotificationsSettingsList
   */
  NotificationsPermissionSettingsList: NotificationsPermissionSettingsListStrings;

  /**
   * Note that’s displayed if user needs to enable permissions before they can
   * enable notifications.
   */
  NotificationsPrerequisitesNotice: NotificationsPrerequisitesNoticeStrings;

  /**
   * Explanation of the background location sharing feature. Displayed in the
   * settings page when the user has granted the required permissions.
   */
  NotificationsPrerequisitesNoticeFunctionalityExplanation: NotificationsPrerequisitesNoticeFunctionalityExplanationStrings;

  /**
   * Item in list of permissions required to enable notifications.
   */
  NotificationsPrerequisitesNoticeListItem: NotificationsPrerequisitesNoticeListItemStrings;

  /**
   * HomePage - OnBoarding Carousel
   */
  OnBoardingCarousel: OnboardingCarouselStrings;

  /**
   * Settings Page - P2P
   */
  P2PSettingSection: P2PSettingSectionStrings;

  /**
   * Page metadata (including SEO and social media tags).
   */
  PageMeta: PageMetaStrings;

  /**
   * PointOfInterest
   */
  PointOfInterestListItem: PointOfInterestListItemStrings;

  /**
   * PointOfInterest Page
   */
  PointsOfInterestPage: PointsOfInterestPageStrings;

  /**
   * Delete report confirmation button and overlay.
   */
  ReportActionDeleteButton: ReportActionDeleteButtonStrings;

  /**
   * Report Info - Report Description Overlay
   */
  ReportDescriptionOverlay: ReportDescriptionOverlayStrings;

  /**
   * ReportErrorMessageDialog
   */
  ReportErrorMessageDialog: ReportErrorMessageDialogStrings;

  /**
   * "Report location" button.
   */
  ReportOverlayReportLocationButton: ReportOverlayReportLocationButtonStrings;

  /**
   * Report Overlay - Report Type Selection
   */
  ReportTypeSelection: ReportTypeSelectionStrings;

  /**
   * ReportsPage
   */
  ReportsPage: ReportsPageStrings;

  /**
   * Know Your SearchBox
   */
  SearchBox: SearchBoxStrings;

  /**
   * Settings page (/fa/settings).
   */
  SettingsPage: SettingsPageStrings;

  /**
   * Settings page - UninstallApplicationSection.
   */
  UninstallApplicationSection: UninstallApplicationSectionStrings;

  /**
   * UserGuide page (/fa/user-guide).
   */
  UserGuidePage: UserGuidePageStrings;

  /**
   * User report edit/submit comment form (full-screen, slides up from bottom).
   */
  UserReportCommentsForm: UserReportCommentsFormStrings;

  /**
   * UserReportGroupMembers
   */
  UserReportGroupMembers: UserReportGroupMembersStrings;

  /**
   * Report Overlay - UserReportGroupMinimalS
   */
  UserReportGroupMinimal: UserReportGroupMinimalStrings;

  /**
   * Shared strings.
   */
  shared: SharedStrings;
};

// Via https://stackoverflow.com/a/47058976/7949868

type Join<T extends Array<string>, D extends string> = T extends []
  ? never
  : T extends [infer F]
    ? F
    : T extends [infer F, ...infer R]
      ? F extends string
        ? `${F}${D}${Join<Extract<R, Array<string>>, D>}`
        : never
      : string;

type PathsToStringProps<T> = T extends string
  ? []
  : {
      [K in Extract<keyof T, string>]: [K, ...PathsToStringProps<T[K]>];
    }[Extract<keyof T, string>];

export type StringKey = Join<PathsToStringProps<Strings>, ".">;
