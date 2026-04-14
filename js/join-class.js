(function () {
  "use strict";

  const LIVE_CLASS_PIN = "Duksha@2008";
  let currentApi = null;
  let currentMeetingPassword = "";
  let pendingStudentPassword = "";

  function getElement(id) {
    return document.getElementById(id);
  }

  function setMessage(message, type) {
    const messageBox = getElement("meeting-message");
    if (!messageBox) {
      return;
    }

    messageBox.textContent = message;
    messageBox.className = "message-box";
    messageBox.classList.add(type === "error" ? "is-error" : "is-info");
  }

  function sanitizeRoomName(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .replace(/-{2,}/g, "-");
  }

  function generateRoomName(teacherName, subject, classTitle) {
    const parts = [teacherName, subject, classTitle]
      .map(sanitizeRoomName)
      .filter(Boolean);

    if (!parts.length) {
      return "";
    }

    return parts.join("-");
  }

  function destroyMeeting() {
    if (currentApi) {
      currentApi.dispose();
      currentApi = null;
    }

    const container = getElement("jitsi-container");
    if (container) {
      container.innerHTML = "";
    }

    pendingStudentPassword = "";
    currentMeetingPassword = "";
  }

  function updateRoomCode(roomCode) {
    const roomCodeValue = getElement("generated-room-code");
    if (roomCodeValue) {
      roomCodeValue.textContent = roomCode || "Room code will appear here after generation.";
    }

    const shareLinkValue = getElement("shareable-join-link");
    if (shareLinkValue) {
      if (!roomCode) {
        shareLinkValue.textContent = "Join link will appear here after room code generation.";
      } else {
        const joinUrl = new URL(window.location.href);
        joinUrl.searchParams.set("room", roomCode);
        shareLinkValue.textContent = joinUrl.toString();
      }
    }
  }

  function setTab(activeTab) {
    document.querySelectorAll("[data-tab-button]").forEach(function (button) {
      const isActive = button.dataset.tabButton === activeTab;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-selected", String(isActive));
    });

    document.querySelectorAll("[data-tab-panel]").forEach(function (panel) {
      panel.hidden = panel.dataset.tabPanel !== activeTab;
    });
  }

  function updateTeacherAccess(hasTeacherAccess) {
    const startTabButton = getElement("start-class-tab");
    const startPanel = document.querySelector('[data-tab-panel="start"]');
    const teacherAccessNote = getElement("teacher-access-note");

    if (startTabButton) {
      startTabButton.style.display = hasTeacherAccess ? "" : "none";
    }

    if (teacherAccessNote) {
      teacherAccessNote.style.display = hasTeacherAccess ? "none" : "";
    }

    if (startPanel && !hasTeacherAccess) {
      startPanel.hidden = true;
    }
  }

  function setPinMessage(message, isError) {
    const messageElement = getElement("live-class-pin-message");
    if (!messageElement) {
      return;
    }

    messageElement.textContent = message;
    messageElement.style.color = isError ? "#b33535" : "";
  }

  function unlockLiveClass() {
    const pinInput = getElement("live-class-pin");
    const accessSection = getElement("live-class-access");
    const liveClassContent = getElement("live-class-content");

    if (!pinInput || !accessSection || !liveClassContent) {
      return false;
    }

    if (pinInput.value !== LIVE_CLASS_PIN) {
      setPinMessage("The PIN is incorrect. Please enter the correct live class PIN.", true);
      pinInput.focus();
      return false;
    }

    accessSection.classList.add("hidden");
    liveClassContent.classList.remove("hidden");
    setPinMessage("Access granted.", false);
    return true;
  }

  function loadJitsiMeeting(roomName, displayName, password, teacherMode) {
    if (!window.JitsiMeetExternalAPI) {
      setMessage("Jitsi could not load. Please refresh the page and try again.", "error");
      return null;
    }

    destroyMeeting();

    const container = getElement("jitsi-container");
    if (!container) {
      setMessage("Meeting area is missing on this page.", "error");
      return null;
    }

    currentMeetingPassword = password || "";
    pendingStudentPassword = teacherMode ? "" : (password || "");

    currentApi = new window.JitsiMeetExternalAPI("meet.jit.si", {
      roomName: roomName,
      parentNode: container,
      width: "100%",
      height: 700,
      userInfo: {
        displayName: displayName
      },
      configOverwrite: {
        prejoinPageEnabled: false
      },
      interfaceConfigOverwrite: {
        MOBILE_APP_PROMO: false
      }
    });

    currentApi.addEventListener("participantRoleChanged", function (event) {
      if (!teacherMode || event.role !== "moderator") {
        return;
      }

      if (currentMeetingPassword) {
        try {
          currentApi.executeCommand("password", currentMeetingPassword);
          setMessage("Class started. Password has been applied for the room.", "info");
        } catch (error) {
          setMessage("Class started, but the room password could not be applied automatically.", "error");
        }
      } else {
        setMessage("Class started successfully. Share the room code with students.", "info");
      }

      try {
        currentApi.executeCommand("toggleLobby", true);
      } catch (error) {
        // Lobby mode may not be available in all Jitsi contexts.
      }
    });

    currentApi.addEventListener("passwordRequired", function () {
      if (!pendingStudentPassword) {
        setMessage("This class needs a password. Enter the password and join again.", "error");
        return;
      }

      try {
        currentApi.executeCommand("password", pendingStudentPassword);
        setMessage("Joining the protected room now.", "info");
      } catch (error) {
        setMessage("The room requested a password, but it could not be submitted automatically.", "error");
      }
    });

    currentApi.addEventListener("videoConferenceJoined", function () {
      if (!teacherMode) {
        setMessage("You joined the class successfully.", "info");
      }
    });

    return currentApi;
  }

  function startTeacherClass() {
    const teacherName = getElement("teacher-name").value.trim();
    const subject = getElement("teacher-subject").value.trim();
    const classTitle = getElement("class-title").value.trim();
    const manualRoomCode = getElement("manual-room-code").value.trim();
    const password = getElement("room-password").value.trim();

    if (!manualRoomCode && (!teacherName || !subject || !classTitle)) {
      setMessage("Please fill in teacher name, subject, and class title before starting the class.", "error");
      return;
    }

    const roomName = manualRoomCode
      ? sanitizeRoomName(manualRoomCode)
      : generateRoomName(teacherName, subject, classTitle);

    if (!roomName) {
      setMessage("A valid room code could not be created. Please review the entered details.", "error");
      return;
    }

    updateRoomCode(roomName);
    loadJitsiMeeting(roomName, teacherName || "Teacher", password, true);
    setMessage("You control this class. Share the room code and password manually only with the users you want.", "info");
  }

  function joinStudentClass() {
    const studentName = getElement("student-name").value.trim();
    const roomCodeInput = getElement("room-code").value.trim();
    const password = getElement("join-password").value.trim();

    if (!studentName) {
      setMessage("Please enter your name before joining the class.", "error");
      return;
    }

    if (!roomCodeInput) {
      setMessage("Please enter the room code shared by your teacher.", "error");
      return;
    }

    const roomCode = sanitizeRoomName(roomCodeInput);
    if (!roomCode) {
      setMessage("The room code is not valid. Please check and try again.", "error");
      return;
    }

    updateRoomCode(roomCode);
    loadJitsiMeeting(roomCode, studentName, password, false);
    setMessage("Joining the live class. If the room is protected, your password will be used automatically.", "info");
  }

  document.addEventListener("DOMContentLoaded", function () {
    const currentUrl = new URL(window.location.href);
    const initialRoom = sanitizeRoomName(currentUrl.searchParams.get("room") || "");
    const hasTeacherAccess = currentUrl.searchParams.get("role") === "teacher";
    const unlockButton = getElement("unlock-live-class-btn");
    const pinInput = getElement("live-class-pin");

    if (unlockButton) {
      unlockButton.addEventListener("click", unlockLiveClass);
    }

    if (pinInput) {
      pinInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          event.preventDefault();
          unlockLiveClass();
        }
      });
    }

    updateRoomCode(initialRoom);
    updateTeacherAccess(hasTeacherAccess);
    setTab(hasTeacherAccess && !initialRoom ? "start" : "join");
    setMessage("Choose Start Class or Join Class to begin.", "info");

    if (initialRoom) {
      const roomCodeField = getElement("room-code");
      if (roomCodeField) {
        roomCodeField.value = initialRoom;
      }
    }

    ["teacher-name", "teacher-subject", "class-title", "manual-room-code"].forEach(function (id) {
      const field = getElement(id);
      if (!field) {
        return;
      }

      field.addEventListener("input", function () {
        const manualRoomCode = getElement("manual-room-code").value.trim();
        const roomName = manualRoomCode
          ? sanitizeRoomName(manualRoomCode)
          : generateRoomName(
              getElement("teacher-name").value,
              getElement("teacher-subject").value,
              getElement("class-title").value
            );

        updateRoomCode(roomName);
      });
    });

    document.querySelectorAll("[data-tab-button]").forEach(function (button) {
      button.addEventListener("click", function () {
        if (button.dataset.tabButton === "start" && !hasTeacherAccess) {
          setMessage("Start Class is available only through your private teacher link.", "error");
          return;
        }

        setTab(button.dataset.tabButton);
      });
    });

    const startButton = getElement("start-class-btn");
    const joinButton = getElement("join-class-btn");
    const endButton = getElement("end-meeting-btn");
    const copyRoomCodeButton = getElement("copy-room-code-btn");
    const copyInviteButton = getElement("copy-invite-btn");

    if (startButton) {
      startButton.addEventListener("click", function () {
        if (!hasTeacherAccess) {
          setMessage("Start Class is available only through your private teacher link.", "error");
          return;
        }

        startTeacherClass();
      });
    }

    if (joinButton) {
      joinButton.addEventListener("click", joinStudentClass);
    }

    if (endButton) {
      endButton.addEventListener("click", function () {
        destroyMeeting();
        updateRoomCode("");
        setMessage("The current embedded meeting has been closed.", "info");
      });
    }

    if (copyRoomCodeButton) {
      copyRoomCodeButton.addEventListener("click", async function () {
        const roomCode = getElement("generated-room-code").textContent.trim();
        if (!roomCode || roomCode === "Room code will appear here after generation.") {
          setMessage("Create or enter a room code first, then copy it.", "error");
          return;
        }

        try {
          await navigator.clipboard.writeText(roomCode);
          setMessage("Room code copied. You can now send it manually.", "info");
        } catch (error) {
          setMessage("Copy failed on this device. Please copy the room code manually from the page.", "error");
        }
      });
    }

    if (copyInviteButton) {
      copyInviteButton.addEventListener("click", async function () {
        const roomCode = getElement("generated-room-code").textContent.trim();
        const shareLink = getElement("shareable-join-link").textContent.trim();
        const password = getElement("room-password").value.trim() || "No password";

        if (!roomCode || roomCode === "Room code will appear here after generation.") {
          setMessage("Create or enter a room code first, then copy the invite details.", "error");
          return;
        }

        const inviteText = [
          "Join your live class here:",
          shareLink,
          "",
          "Room Code: " + roomCode,
          "Password: " + password
        ].join("\n");

        try {
          await navigator.clipboard.writeText(inviteText);
          setMessage("Invite details copied. You can paste them in WhatsApp, SMS, or email.", "info");
        } catch (error) {
          setMessage("Copy failed on this device. Please copy the room code and password manually.", "error");
        }
      });
    }
  });

  window.sanitizeRoomName = sanitizeRoomName;
  window.generateRoomName = generateRoomName;
  window.startTeacherClass = startTeacherClass;
  window.joinStudentClass = joinStudentClass;
  window.loadJitsiMeeting = loadJitsiMeeting;
  window.destroyMeeting = destroyMeeting;
}());
