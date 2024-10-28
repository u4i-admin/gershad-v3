import { FirebaseAnalytics } from "@capacitor-firebase/analytics";

import { isNativePlatform } from "src/values/appValues";

/**
 * Wrapper around `FirebaseAnalytics.logEvent`. Skips call for web platform,
 * replacing with a console message.
 *
 * If we want to launch a web version in the future we could replace the console
 * message with a Google Analytics web tracking call.
 */
const webSafeLogEvent: typeof FirebaseAnalytics.logEvent = (options) => {
  if (isNativePlatform) {
    return FirebaseAnalytics.logEvent(options);
  } else {
    console.info("[firebaseAnalytics] webSafeLogEvent (no-op):", options);
    return Promise.resolve();
  }
};

// ===========
// === Nav ===
// ===========

export const logNavAboutClick = async (url: string) =>
  webSafeLogEvent({
    name: "nav_about_click",
    params: {
      analytics_screen_name: url,
    },
  });

export const logNavFaqClick = async (url: string) =>
  webSafeLogEvent({
    name: "nav_faq_click",
    params: { analytics_screen_name: url },
  });

export const logNavFeedbackEmailClick = async (url: string) =>
  webSafeLogEvent({
    name: "nav_feedback_email_click",
    params: { analytics_screen_name: url },
  });

export const logNavKyrClick = async (url: string) =>
  webSafeLogEvent({
    name: "nav_kyr_click",
    params: { analytics_screen_name: url },
  });

export const logNavSettingsClick = async (url: string) =>
  webSafeLogEvent({
    name: "nav_settings_click",
    params: { analytics_screen_name: url },
  });

export const logNavUninstallAppClick = async (url: string) =>
  webSafeLogEvent({
    name: "nav_uninstall_app_click",
    params: { analytics_screen_name: url },
  });

// ===============
// === Reports ===
// ===============

export const logAddReportFail = async () =>
  webSafeLogEvent({
    name: "add_report_fail",
  });

export const logAddReportSuccess = async () =>
  webSafeLogEvent({
    name: "add_report_success",
  });

export const logAddReportRejectTooManyReports = async () =>
  webSafeLogEvent({
    name: "add_report_reject_too_many_reports",
  });

export const logDeleteReportFail = async () =>
  webSafeLogEvent({
    name: "delete_report_fail",
  });

export const logDeleteReportSuccess = async () =>
  webSafeLogEvent({
    name: "delete_report_success",
  });

export const logShareReport = async (url: string) =>
  webSafeLogEvent({
    name: "share_report",
    params: {
      analytics_screen_name: url,
    },
  });

export const logUpdateReportFail = async (url?: string) =>
  webSafeLogEvent({
    name: "update_report_fail",
    params: url ? { analytics_screen_name: url } : {},
  });

export const logUpdateReportSuccess = async (url?: string) =>
  webSafeLogEvent({
    name: "update_report_success",
    params: url ? { analytics_screen_name: url } : {},
  });

// ============================
// === Notification Reports ===
// ============================

export const logEnableNotifEnterHotZone = async () =>
  webSafeLogEvent({
    name: "enable_notif_enter_hot_zone",
  });

export const logEnableNotifReportNearSavedLocations = async () =>
  webSafeLogEvent({
    name: "enable_notif_report_near_saved_locations",
  });

export const logEnableNotifReportNearYou = async () =>
  webSafeLogEvent({
    name: "enable_notif_report_near_you",
  });

// =========================
// === Location log event===
// =========================

export const logDeleteLocationFail = async (url?: string) =>
  webSafeLogEvent({
    name: "delete_location_fail",
    params: url ? { analytics_screen_name: url } : {},
  });

export const logDeleteLocationSuccess = async (url?: string) =>
  webSafeLogEvent({
    name: "delete_location_success",
    params: url ? { analytics_screen_name: url } : {},
  });

export const logSaveLocationFail = async () =>
  webSafeLogEvent({
    name: "save_location_fail",
  });

export const logSaveLocationSuccess = async () =>
  webSafeLogEvent({
    name: "save_location_success",
  });

export const logEnableUninstallFeature = async () =>
  webSafeLogEvent({
    name: "enable_uninstall_feature",
  });

// =============================
// === KYR(Know Your Rights) ===
// =============================

export const logKyrChapterItemClick = async (chapterId: number) =>
  webSafeLogEvent({
    name: "kyr_chapter_item_click",
    params: {
      chapter_id: chapterId,
    },
  });

export const logKyrDataLoadFail = async () =>
  webSafeLogEvent({
    name: "kyr_data_load_FAIL",
  });

export const logKyrDataLoadSuccess = async () =>
  webSafeLogEvent({
    name: "kyr_data_load_success",
  });

export const logKyrSectionItemClick = async (sectionID: number) =>
  webSafeLogEvent({
    name: "kyr_section_item_click",
    params: {
      section_id: sectionID,
    },
  });

// ===============================
// === NotificationsPermission ===
// ===============================

export const logNotificationsPermissionDeniedClick = async () =>
  webSafeLogEvent({
    name: "notifications_permission_denied",
  });

export const logNotificationsPermissionGrantedClick = async () =>
  webSafeLogEvent({
    name: "notifications_permission_granted",
  });

// ==================
// === Screen View===
// ==================

export const logTrackScreenView = async (url: string) =>
  webSafeLogEvent({
    name: "screen_view",
    params: { screen_name: url },
  });
