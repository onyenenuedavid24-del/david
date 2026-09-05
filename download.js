/* =====================================================
   DOWNLOAD PAGE - ANIME ALLEY
===================================================== */


/* =====================================================
   ELEMENTS
===================================================== */

const episodeCheckboxes =
    document.querySelectorAll(".episode-checkbox");

const episodeRows =
    document.querySelectorAll("[data-episode-row]");

const selectAll =
    document.getElementById("selectAll");

const clearSelection =
    document.getElementById("clearSelection");

const applyRange =
    document.getElementById("applyRange");

const rangeStart =
    document.getElementById("rangeStart");

const rangeEnd =
    document.getElementById("rangeEnd");


const downloadPanel =
    document.getElementById("downloadPanel");

const closeDownload =
    document.getElementById("closeDownload");

const collapseDownload =
    document.getElementById("collapseDownload");


const resolution =
    document.getElementById("resolution");

const selectedCount =
    document.getElementById("selectedCount");

const totalSize =
    document.getElementById("totalSize");

const downloadBtn =
    document.getElementById("downloadBtn");


const mobileDownloadBar =
    document.getElementById("mobileDownloadBar");

const mobileSelectedCount =
    document.getElementById("mobileSelectedCount");

const mobileTotalSize =
    document.getElementById("mobileTotalSize");

const mobileDownloadBtn =
    document.getElementById("mobileDownloadBtn");


/* =====================================================
   ONBOARDING ELEMENTS
===================================================== */

const onboardingOverlay =
    document.getElementById("onboardingOverlay");

const onboardingClose =
    document.getElementById("onboardingClose");

const onboardingSkip =
    document.getElementById("onboardingSkip");

const onboardingEnable =
    document.getElementById("onboardingEnable");

const onboardingOk =
    document.getElementById("onboardingOk");

const dontShowAgain =
    document.getElementById("dontShowAgain");

const autoDownload =
    document.getElementById("autoDownload");

const episodeNotifications =
    document.getElementById("episodeNotifications");


/* =====================================================
   THREE DOT MENU
===================================================== */

const menuDots =
    document.getElementById("menuDots");

const dotsMenu =
    document.getElementById("dotsMenu");

const logoutBtn =
    document.getElementById("logoutBtn");


/* =====================================================
   MOBILE SEARCH
===================================================== */

const mobileSearch =
    document.getElementById("mobileSearch");

const mobileSearchBox =
    document.getElementById("mobileSearchBox");

const mobileSearchInput =
    document.getElementById("mobileSearchInput");


/* =====================================================
   BACK BUTTON
===================================================== */

const backBtn =
    document.getElementById("backBtn");


/* =====================================================
   ONBOARDING
===================================================== */

/*
   The tutorial is shown once.

   Once the user completes it, we remember that it
   has already been seen.
*/

let onboardingHasBeenShown =
    localStorage.getItem(
        "animeAlleyAutoDownloadSeen"
    ) === "true";


function shouldShowOnboarding() {

    return !onboardingHasBeenShown;

}


function showOnboarding() {

    if (!shouldShowOnboarding()) {
        return;
    }

    if (onboardingSkip) {
        onboardingSkip.style.display = "";
    }

    if (onboardingEnable) {
        onboardingEnable.style.display = "";
    }

    if (onboardingOk) {
        onboardingOk.hidden = true;
    }

    onboardingOverlay.classList.add("show");

}


function finishOnboarding() {

    onboardingOverlay.classList.remove("show");

    onboardingHasBeenShown = true;

    localStorage.setItem(
        "animeAlleyAutoDownloadSeen",
        "true"
    );

}


function showOnboardingOK() {

    if (onboardingSkip) {
        onboardingSkip.style.display = "none";
    }

    if (onboardingEnable) {
        onboardingEnable.style.display = "none";
    }

    if (onboardingOk) {
        onboardingOk.hidden = false;

        onboardingOk.focus();
    }

}


/* =====================================================
   ONBOARDING CLOSE
===================================================== */

if (onboardingClose) {

    onboardingClose.addEventListener(
        "click",
        () => {

            finishOnboarding();

        }
    );

}


/* =====================================================
   SKIP
===================================================== */

if (onboardingSkip) {

    onboardingSkip.addEventListener(
        "click",
        () => {

            if (autoDownload) {
                autoDownload.checked = false;
            }

            if (episodeNotifications) {
                episodeNotifications.checked = false;
            }

            /*
               The notification changes into an OK
               confirmation screen.
            */

            showOnboardingOK();

        }
    );

}


/* =====================================================
   TURN ON AUTO DOWNLOAD
===================================================== */

if (onboardingEnable) {

    onboardingEnable.addEventListener(
        "click",
        () => {

            if (autoDownload) {
                autoDownload.checked = true;
            }

            if (episodeNotifications) {
                episodeNotifications.checked = true;
            }

            /*
               Do not immediately close the notification.
               User must press OK.
            */

            showOnboardingOK();

        }
    );

}


/* =====================================================
   OK
===================================================== */

if (onboardingOk) {

    onboardingOk.addEventListener(
        "click",
        () => {

            /*
               If "Don't show again" is checked,
               permanently remember it.

               Otherwise this tutorial is still marked
               as seen for this session.
            */

            if (
                dontShowAgain &&
                dontShowAgain.checked
            ) {

                localStorage.setItem(
                    "animeAlleyAutoDownloadSeen",
                    "true"
                );

            }

            finishOnboarding();

        }
    );

}


/* =====================================================
   CLICKABLE EPISODE ROW
===================================================== */

/*
   The whole episode card is clickable.

   Clicking the checkbox itself is left alone so the
   browser can handle the checkbox normally.
*/

episodeRows.forEach(
    row => {

        row.addEventListener(
            "click",
            event => {

                if (
                    event.target.closest(
                        ".episode-checkbox"
                    )
                ) {
                    return;
                }


                const checkbox =
                    row.querySelector(
                        ".episode-checkbox"
                    );


                if (!checkbox) {
                    return;
                }


                checkbox.checked =
                    !checkbox.checked;


                checkbox.dispatchEvent(
                    new Event(
                        "change",
                        {
                            bubbles: true
                        }
                    )
                );

            }
        );

    }
);


/* =====================================================
   DOWNLOAD CALCULATION
===================================================== */

function updateDownloadInfo() {

    const selectedEpisodes =
        Array.from(
            episodeCheckboxes
        ).filter(
            checkbox =>
                checkbox.checked
        );


    const count =
        selectedEpisodes.length;


    let baseSize = 0;


    selectedEpisodes.forEach(
        episode => {

            baseSize += Number(
                episode.dataset.size
            );

        }
    );


    const multiplier =
        Number(resolution.value);


    const calculatedSize =
        baseSize * multiplier;


    /* COUNT */

    selectedCount.textContent =
        count;


    /* SIZE */

    if (calculatedSize >= 1000) {

        totalSize.textContent =
            `${(
                calculatedSize / 1000
            ).toFixed(2)} GB`;

    } else {

        totalSize.textContent =
            `${Math.round(
                calculatedSize
            )} MB`;

    }


    /* MOBILE */

    mobileSelectedCount.textContent =
        `${count} episode${
            count === 1 ? "" : "s"
        }`;

    mobileTotalSize.textContent =
        totalSize.textContent;


    /* =================================================
       SELECTION STATE
    ================================================= */

    if (count > 0) {

        /*
           Show the small mobile bar.
        */

        mobileDownloadBar.style.display =
            "flex";


        downloadBtn.disabled =
            false;


    } else {

        /*
           No episodes selected.
           Remove all download UI.
        */

        mobileDownloadBar.style.display =
            "none";


        downloadPanel.classList.remove(
            "show"
        );


        downloadPanel.classList.remove(
            "collapsed"
        );


        downloadBtn.disabled =
            true;

    }

}


/* =====================================================
   OPEN DOWNLOAD PANEL
===================================================== */

function openDownloadPanel() {

    const selected =
        document.querySelectorAll(
            ".episode-checkbox:checked"
        );


    if (selected.length === 0) {
        return;
    }


    /*
       IMPORTANT:

       If the user manually collapsed the panel,
       do NOT reopen it automatically.
    */

    if (
        downloadPanel.classList.contains(
            "collapsed"
        )
    ) {
        return;
    }


    downloadPanel.classList.add(
        "show"
    );

}


/* =====================================================
   EPISODE CHANGE
===================================================== */

episodeCheckboxes.forEach(
    checkbox => {

        checkbox.addEventListener(
            "change",
            () => {

                updateSelectAll();

                updateDownloadInfo();


                /*
                   Only open the panel if it has not
                   been deliberately collapsed.
                */

                if (
                    checkbox.checked &&
                    !downloadPanel.classList.contains(
                        "collapsed"
                    )
                ) {

                    openDownloadPanel();


                    /*
                       Auto-download tutorial only
                       appears once.
                    */

                    if (
                        shouldShowOnboarding()
                    ) {

                        showOnboarding();

                    }

                }

            }
        );

    }
);


/* =====================================================
   SELECT ALL
===================================================== */

if (selectAll) {

    selectAll.addEventListener(
        "change",
        () => {

            episodeCheckboxes.forEach(
                checkbox => {

                    checkbox.checked =
                        selectAll.checked;

                }
            );


            updateDownloadInfo();


            if (selectAll.checked) {

                if (
                    !downloadPanel.classList.contains(
                        "collapsed"
                    )
                ) {

                    openDownloadPanel();

                }


                if (
                    shouldShowOnboarding()
                ) {

                    showOnboarding();

                }

            }

        }
    );

}


/* =====================================================
   UPDATE SELECT ALL
===================================================== */

function updateSelectAll() {

    if (!selectAll) {
        return;
    }


    selectAll.checked =
        episodeCheckboxes.length > 0 &&
        Array.from(
            episodeCheckboxes
        ).every(
            checkbox =>
                checkbox.checked
        );

}


/* =====================================================
   RANGE
===================================================== */

if (applyRange) {

    applyRange.addEventListener(
        "click",
        () => {

            const start =
                Number(
                    rangeStart.value
                );


            const end =
                Number(
                    rangeEnd.value
                );


            if (
                !rangeStart.value ||
                !rangeEnd.value
            ) {

                alert(
                    "Please enter both the starting and ending episode."
                );

                return;

            }


            if (
                start < 1 ||
                end < 1
            ) {

                alert(
                    "Episode numbers must be 1 or higher."
                );

                return;

            }


            if (start > end) {

                alert(
                    "The starting episode cannot be greater than the ending episode."
                );

                return;

            }


            episodeCheckboxes.forEach(
                checkbox => {

                    const episodeNumber =
                        Number(
                            checkbox.dataset.episode
                        );


                    checkbox.checked =
                        episodeNumber >= start &&
                        episodeNumber <= end;

                }
            );


            updateSelectAll();

            updateDownloadInfo();


            const selected =
                document.querySelectorAll(
                    ".episode-checkbox:checked"
                );


            if (selected.length > 0) {

                if (
                    !downloadPanel.classList.contains(
                        "collapsed"
                    )
                ) {

                    openDownloadPanel();

                }


                if (
                    shouldShowOnboarding()
                ) {

                    showOnboarding();

                }

            }

        }
    );

}


/* =====================================================
   CLEAR
===================================================== */

if (clearSelection) {

    clearSelection.addEventListener(
        "click",
        () => {

            episodeCheckboxes.forEach(
                checkbox => {

                    checkbox.checked =
                        false;

                }
            );


            if (selectAll) {
                selectAll.checked = false;
            }


            updateDownloadInfo();

        }
    );

}


/* =====================================================
   RESOLUTION
===================================================== */

if (resolution) {

    resolution.addEventListener(
        "change",
        updateDownloadInfo
    );

}


/* =====================================================
   CLOSE DOWNLOAD PANEL
===================================================== */

if (closeDownload) {

    closeDownload.addEventListener(
        "click",
        () => {

            /*
               Closing the panel does not delete
               selected episodes.
            */

            downloadPanel.classList.remove(
                "show"
            );


            downloadPanel.classList.remove(
                "collapsed"
            );


            updateCollapseButton();

        }
    );

}


/* =====================================================
   COLLAPSE / EXPAND
===================================================== */

function updateCollapseButton() {

    if (!collapseDownload) {
        return;
    }


    const collapsed =
        downloadPanel.classList.contains(
            "collapsed"
        );


    collapseDownload.setAttribute(
        "aria-expanded",
        collapsed ? "false" : "true"
    );


    if (collapsed) {

        collapseDownload.setAttribute(
            "aria-label",
            "Show download options"
        );

        collapseDownload.setAttribute(
            "title",
            "Show download options"
        );

    } else {

        collapseDownload.setAttribute(
            "aria-label",
            "Hide download options"
        );

        collapseDownload.setAttribute(
            "title",
            "Hide download options"
        );

    }

}


if (collapseDownload) {

    collapseDownload.addEventListener(
        "click",
        event => {

            event.stopPropagation();


            downloadPanel.classList.toggle(
                "collapsed"
            );


            /*
               Once collapsed, selecting another
               episode will NOT reopen it.
            */

            updateCollapseButton();

        }
    );

}


/* =====================================================
   MOBILE DOWNLOAD BAR
===================================================== */

if (mobileDownloadBtn) {

    mobileDownloadBtn.addEventListener(
        "click",
        () => {

            if (
                downloadPanel.classList.contains(
                    "collapsed"
                )
            ) {

                /*
                   Bring the panel back up.
                */

                downloadPanel.classList.remove(
                    "collapsed"
                );

                downloadPanel.classList.add(
                    "show"
                );

                updateCollapseButton();

                return;

            }


            openDownloadPanel();

        }
    );

}


/* =====================================================
   DOWNLOAD BUTTON
===================================================== */

if (downloadBtn) {

    downloadBtn.addEventListener(
        "click",
        () => {

            const selectedEpisodes =
                Array.from(
                    episodeCheckboxes
                ).filter(
                    checkbox =>
                        checkbox.checked
                );


            if (
                selectedEpisodes.length === 0
            ) {
                return;
            }


            alert(
                `Preparing ${selectedEpisodes.length} episode(s) for download.`
            );

        }
    );

}


/* =====================================================
   MOBILE DOWNLOAD BUTTON
===================================================== */

if (mobileDownloadBtn) {

    mobileDownloadBtn.addEventListener(
        "click",
        () => {

            const selectedEpisodes =
                Array.from(
                    episodeCheckboxes
                ).filter(
                    checkbox =>
                        checkbox.checked
                );


            if (
                selectedEpisodes.length === 0
            ) {
                return;
            }


            /*
               If panel is collapsed, first tap
               brings it back instead of downloading.
            */

            if (
                downloadPanel.classList.contains(
                    "collapsed"
                )
            ) {

                downloadPanel.classList.remove(
                    "collapsed"
                );

                downloadPanel.classList.add(
                    "show"
                );

                updateCollapseButton();

                return;

            }


            alert(
                `Preparing ${selectedEpisodes.length} episode(s) for download.`
            );

        }
    );

}


/* =====================================================
   SUB / DUB
===================================================== */

const languageButtons =
    document.querySelectorAll(
        ".language-btn"
    );


languageButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                languageButtons.forEach(
                    btn => {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );

            }
        );

    }
);


/* =====================================================
   BACK
===================================================== */

if (backBtn) {

    backBtn.addEventListener(
        "click",
        () => {

            window.history.back();

        }
    );

}


/* =====================================================
   THREE DOT MENU
===================================================== */

if (
    menuDots &&
    dotsMenu
) {

    menuDots.addEventListener(
        "click",
        event => {

            event.stopPropagation();


            const open =
                dotsMenu.classList.toggle(
                    "show"
                );


            menuDots.setAttribute(
                "aria-expanded",
                open ? "true" : "false"
            );

        }
    );


    document.addEventListener(
        "click",
        event => {

            if (
                !dotsMenu.contains(
                    event.target
                ) &&
                !menuDots.contains(
                    event.target
                )
            ) {

                dotsMenu.classList.remove(
                    "show"
                );


                menuDots.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }
    );

}


/* =====================================================
   LOGOUT
===================================================== */

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        () => {

            if (
                confirm(
                    "Are you sure you want to log out?"
                )
            ) {

                window.location.href =
                    "login.html";

            }

        }
    );

}


/* =====================================================
   MOBILE SEARCH
===================================================== */

if (mobileSearch) {

    mobileSearch.addEventListener(
        "click",
        event => {

            event.stopPropagation();


            mobileSearchBox.classList.toggle(
                "show"
            );


            if (
                mobileSearchBox.classList.contains(
                    "show"
                )
            ) {

                mobileSearchInput.focus();

            }

        }
    );

}


/*
   IMPORTANT:

   Tap anywhere outside the search box and it
   disappears.

   This means the user does NOT have to press
   the search icon again to close it.
*/

document.addEventListener(
    "click",
    event => {

        if (
            mobileSearchBox &&
            mobileSearch &&
            !mobileSearchBox.contains(
                event.target
            ) &&
            !mobileSearch.contains(
                event.target
            )
        ) {

            mobileSearchBox.classList.remove(
                "show"
            );

        }

    }
);


/*
   Prevent clicks inside the search box from
   closing it.
*/

if (mobileSearchBox) {

    mobileSearchBox.addEventListener(
        "click",
        event => {

            event.stopPropagation();

        }
    );

}


/* =====================================================
   INITIAL STATE
===================================================== */

if (mobileDownloadBar) {

    mobileDownloadBar.style.display =
        "none";

}


if (downloadPanel) {

    downloadPanel.classList.remove(
        "show"
    );

    downloadPanel.classList.remove(
        "collapsed"
    );

}


updateCollapseButton();

updateDownloadInfo();
