import { StylableFC } from "@asl-19/react-dom-utils";
import { App, AppInfo } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { css } from "@emotion/react";
import Divider from "@mui/material/Divider";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Link from "next/link";
import { useRouter } from "next/router";
import { memo, useCallback, useEffect, useMemo, useState } from "react";

import DeleteAndUpdateConfirmationDialog from "src/components/DeleteAndUpdateConfirmationDialog";
import LogoWithWordmarkSvg from "src/components/icons/logos/LogoWithWordmarkSvg";
import MenuDrawerCheckMarkIconSvg from "src/components/MenuDrawer/icons/MenuDrawerCheckMarkIconSvg";
import MenuDrawerDeleteIconSvg from "src/components/MenuDrawer/icons/MenuDrawerDeleteIconSvg";
import MenuDrawerFaqIconSvg from "src/components/MenuDrawer/icons/MenuDrawerFaqIconSvg";
import MenuDrawerGershadIconSvg from "src/components/MenuDrawer/icons/MenuDrawerGershadIconSvg";
import MenuDrawerKnowYourRightsIconSvg from "src/components/MenuDrawer/icons/MenuDrawerKnowYourRightsIconSvg";
import MenuDrawerMapIconSvg from "src/components/MenuDrawer/icons/MenuDrawerMapIconSvg";
import MenuDrawerMessageIconSvg from "src/components/MenuDrawer/icons/MenuDrawerMessageIconSvg";
import MenuDrawerSettingsIconSvg from "src/components/MenuDrawer/icons/MenuDrawerSettingsIconSvg";
import MenuDrawerStarIconSvg from "src/components/MenuDrawer/icons/MenuDrawerStarIconSvg";
import MenuDrawerSupportIconSvg from "src/components/MenuDrawer/icons/MenuDrawerSupportIconSvg";
import MenuDrawerUpdateIconSvg from "src/components/MenuDrawer/icons/MenuDrawerUpdateIconSvg";
import MenuDrawerLinkList from "src/components/MenuDrawer/MenuDrawerLinkList";
import { MenuDrawerLinkListItemInfo } from "src/components/MenuDrawer/MenuDrawerLinkListItem";
import { menuDrawerContentPaddingInlineStart } from "src/components/MenuDrawer/menuDrawerValues";
import GershadAppUpdateDeletePlugin from "src/plugins/GershadAppUpdateDeletePlugin";
import routeUrls from "src/routeUrls";
import {
  useAppDispatch,
  useAppMenuDrawerIsOpen,
  useAppPreferencesUninstallApplicationEnabled,
  useAppStrings,
} from "src/stores/appStore";
import { MuiSx } from "src/types/styleTypes";
import { logNavUninstallAppClick } from "src/utils/firebaseAnalytics";
import colors from "src/values/colors";

export type MenuDrawerStrings = {
  /**
   * Menu primary list texts
   */
  primaryList: {
    /**
     * Text for a link that navigates users to the main page
     */
    map: string;
    /**
     * Text for a link that navigates users to the "Bookmarked Location" page
     */
    pointsOfInterest: string;
    /**
     * Text for a link that navigates users to "Reports" page
     */
    reports: string;
  };
  /**
   * Menu secondary list texts
   */
  secondaryList: {
    /**
     * Text for a link that navigates users to "About" page
     */
    about: string;
    /**
     * Text for a link that navigates users to FAQs(Frequently Asked Questions) page
     */
    faqs: string;
    /**
     * Text for a link, it opens the user's default email
     * with pre-filled in the "To" field to a specific email address
     */
    sendFeedback: string;
    /**
     * Text for a link that navigates users to "Settings" page
     */
    settings: string;
    /**
     * Button text to prompt app deletion confirmation via a native plugin.
     */
    uninstallApp: string;
    /**
     * Button text to prompt app update confirmation.
     */
    updateAppVersion: string;
    /**
     * Text for a link that navigates users to "User guide" page
     */
    userGuide: string;
  };
  /**
   * Text for updating app version confirmation
   */
  updateConfirmationText: string;
  /**
   * Text version
   */
  version: string;
};

const swipeableDrawerSx: MuiSx = ({ zIndex }) => ({
  zIndex: zIndex.menuDrawer_drawer,
});

const header = css({
  alignItems: "end",
  backgroundColor: colors.yellow,
  display: "flex",
  flex: "0 0 auto",
  // Account for e.g. iOS notch in Capacitor
  height: "calc(8.5rem + env(safe-area-inset-top))",
  padding: "1.375rem",
  paddingInlineStart: menuDrawerContentPaddingInlineStart,
});

const headerLogoLink = css({
  display: "flex",
});

const headerLogo = css({
  height: "4.625rem",
});

const nav = css({
  backgroundColor: colors.lightGrey,
  flex: "1 0 auto",
  width: "17.3125rem",
});

const description = css({
  color: colors.grey,
  fontSize: "0.875rem",
  padding: "1rem",
  paddingInlineStart: menuDrawerContentPaddingInlineStart,
});

const descriptionVersionNumber = css({
  "html.rtl &": {
    direction: "rtl", // Note: stylis-plugin-rtl replaces "rtl" with "ltr"
    unicodeBidi: "embed",
  },
});

const MenuDrawer: StylableFC<{}> = memo((props) => {
  const appDispatch = useAppDispatch();
  const router = useRouter();
  const menuDrawerIsOpen = useAppMenuDrawerIsOpen();
  const strings = useAppStrings();

  const uninstallApplicationEnabled =
    useAppPreferencesUninstallApplicationEnabled();

  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const [capacitorAppInfo, setCapacitorAppInfo] = useState<AppInfo>();

  const [updateAppVersionMenuItemIsShown, setUpdateAppVersionMenuItemIsShown] =
    useState(false);

  useEffect(() => {
    const getUpdateVersion = async () => {
      try {
        //TODO: using env variable for params
        const res = await GershadAppUpdateDeletePlugin.isUpdateAvailable({
          bucketName: process.env.NEXT_PUBLIC_UPDATE_S3_BUCKET_NAME,
          cognitoPoolId: process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID,
          versionFileName: process.env.NEXT_PUBLIC_UPDATE_S3_VERSION_FILE_NAME,
        });

        if (res) {
          setUpdateAppVersionMenuItemIsShown(res.isUpdateNeeded);
        }
      } catch (error) {
        setUpdateAppVersionMenuItemIsShown(false);
        console.error(
          `[GershadAppUpdateDeletePlugin.isUpdateAvailable]: ${error}`,
        );
      }
    };

    if (
      Capacitor.getPlatform() === "android" &&
      process.env.NEXT_PUBLIC_ANDROID_FLAVOR === "independent"
    ) {
      getUpdateVersion();
    }
  }, []);

  const close = useCallback(
    () => appDispatch({ type: "closeMenuDrawer" }),
    [appDispatch],
  );
  const open = useCallback(
    () => appDispatch({ type: "openMenuDrawer" }),
    [appDispatch],
  );

  const onUninstallAppItemClick = useCallback(async () => {
    try {
      const res = await GershadAppUpdateDeletePlugin.selfDelete();
      if (res.isFailed) {
        //TODO: maybe pop up a alert ?
        throw new Error("failed to delete the app");
      }
      logNavUninstallAppClick(router.asPath);
      close();
    } catch (error) {
      close();
      console.error(`[GershadAppUpdateDeletePlugin.selfDelete]: ${error}`);
    }
  }, [close, router.asPath]);

  const onUpdateAppVersionItemClick = useCallback(() => {
    close();
    setOpenDialog(true);
  }, [close]);

  const handleUpdateAppVersion = useCallback(async () => {
    try {
      const res = await GershadAppUpdateDeletePlugin.updateSelf({
        bucketName: process.env.NEXT_PUBLIC_UPDATE_S3_BUCKET_NAME,
        cognitoPoolId: process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID,
        gershadAppFileName: process.env.NEXT_PUBLIC_UPDATE_S3_APP_FILE_NAME,
      });

      if (res.isFailed) {
        //TODO: maybe pop up a alert ?
        throw new Error("failed to update gershad");
      }
    } catch (error) {
      console.error(`[GershadAppUpdateDeletePlugin.updateSelf]: ${error}`);
    }
  }, []);

  const primaryLinkListItemInfos = useMemo<Array<MenuDrawerLinkListItemInfo>>(
    () => [
      {
        href: routeUrls.home(),
        IconComponent: MenuDrawerMapIconSvg,
        text: strings.MenuDrawer.primaryList.map,
      },
      {
        href: routeUrls.reports(),
        IconComponent: MenuDrawerCheckMarkIconSvg,
        text: strings.MenuDrawer.primaryList.reports,
      },
      {
        href: routeUrls.pointsOfInterest(),
        IconComponent: MenuDrawerStarIconSvg,
        text: strings.MenuDrawer.primaryList.pointsOfInterest,
      },
    ],
    [strings],
  );

  const secondaryLinkListItemInfos = useMemo<Array<MenuDrawerLinkListItemInfo>>(
    () => [
      {
        href: routeUrls.settings(),
        IconComponent: MenuDrawerSettingsIconSvg,
        text: strings.MenuDrawer.secondaryList.settings,
      },
      {
        href: routeUrls.userGuide(),
        IconComponent: MenuDrawerSupportIconSvg,
        text: strings.MenuDrawer.secondaryList.userGuide,
      },
      {
        href: `mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL_ADDRESS}`,
        IconComponent: MenuDrawerMessageIconSvg,
        text: strings.MenuDrawer.secondaryList.sendFeedback,
      },
      {
        href: routeUrls.about(),
        IconComponent: MenuDrawerGershadIconSvg,
        text: strings.MenuDrawer.secondaryList.about,
      },
      {
        href: routeUrls.faqs(),
        IconComponent: MenuDrawerFaqIconSvg,
        text: strings.MenuDrawer.secondaryList.faqs,
      },
      {
        href: routeUrls.knowYourRights(),
        IconComponent: MenuDrawerKnowYourRightsIconSvg,
        text: strings.KnowYourRightsPage.pageTitle,
      },
      ...(Capacitor.getPlatform() === "android" &&
      process.env.NEXT_PUBLIC_ANDROID_FLAVOR === "independent"
        ? [
            ...(uninstallApplicationEnabled
              ? [
                  {
                    IconComponent: MenuDrawerDeleteIconSvg,
                    onClick: onUninstallAppItemClick,
                    text: strings.MenuDrawer.secondaryList.uninstallApp,
                  },
                ]
              : []),
            ...(updateAppVersionMenuItemIsShown
              ? [
                  {
                    IconComponent: MenuDrawerUpdateIconSvg,
                    onClick: onUpdateAppVersionItemClick,
                    text: strings.MenuDrawer.secondaryList.updateAppVersion,
                  },
                ]
              : []),
          ]
        : []),
    ],
    [
      onUninstallAppItemClick,
      onUpdateAppVersionItemClick,
      strings.KnowYourRightsPage.pageTitle,
      strings.MenuDrawer.secondaryList.about,
      strings.MenuDrawer.secondaryList.faqs,
      strings.MenuDrawer.secondaryList.sendFeedback,
      strings.MenuDrawer.secondaryList.settings,
      strings.MenuDrawer.secondaryList.uninstallApp,
      strings.MenuDrawer.secondaryList.updateAppVersion,
      strings.MenuDrawer.secondaryList.userGuide,
      uninstallApplicationEnabled,
      updateAppVersionMenuItemIsShown,
    ],
  );

  useEffect(() => {
    (async () => {
      if (Capacitor.isNativePlatform()) {
        const appInfo = await App.getInfo();

        setCapacitorAppInfo(appInfo);
      }
    })();
  }, []);

  return (
    <SwipeableDrawer
      disableSwipeToOpen
      open={menuDrawerIsOpen}
      onClose={close}
      onOpen={open}
      sx={swipeableDrawerSx}
      {...props}
    >
      <div css={header}>
        <Link css={headerLogoLink} href={routeUrls.home()} onClick={close}>
          <LogoWithWordmarkSvg css={headerLogo} />
        </Link>
      </div>

      <nav css={nav}>
        <MenuDrawerLinkList
          closeMenuDrawer={close}
          itemInfos={primaryLinkListItemInfos}
        />

        <Divider />

        <MenuDrawerLinkList
          closeMenuDrawer={close}
          itemInfos={secondaryLinkListItemInfos}
        />

        {capacitorAppInfo && (
          <p css={description}>
            {strings.MenuDrawer.version}{" "}
            <span css={descriptionVersionNumber}>
              {capacitorAppInfo.version} ({capacitorAppInfo.build})
            </span>
          </p>
        )}

        <Divider />
      </nav>
      <DeleteAndUpdateConfirmationDialog
        actionType="update"
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        onConfirmClick={handleUpdateAppVersion}
        description={strings.MenuDrawer.updateConfirmationText}
      />
    </SwipeableDrawer>
  );
});

MenuDrawer.displayName = "MenuDrawer";

export default MenuDrawer;
