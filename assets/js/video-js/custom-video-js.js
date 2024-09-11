const player = videojs("my-video", {
  userActions: {
    doubleClick: false, // Отключаем полноэкранный режим по двойному клику
  },
});

// Задайте источник видео
player.src({
  src: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", // Замените на ваш URL
  type: "application/x-mpegURL",
});

player.ready(function () {
  const myVideoBaner = document.createElement("div");
  myVideoBaner.className = "my-video-baner";
  myVideoBaner.innerHTML = `<div>
            <svg width="86" height="78" viewBox="0 0 86 78" class="AutoPlayBox__icon"><path fill="currentColor" fill-rule="evenodd" d="M44.28 9.05a2 2 0 0 0-3.23-1.58L19.74 24.05a1.9 1.9 0 0 0-1.01.39H5.03a4.5 4.5 0 0 0-4.5 4.48V48.8c0 1.17.46 2.32 1.33 3.17.85.86 2 1.32 3.16 1.32h14.22l21.81 16.96a2 2 0 0 0 3.23-1.58V9.05ZM17.93 28.44H5.03a.5.5 0 0 0-.34.15l-.03.03a.42.42 0 0 0-.12.3V48.8c0 .14.05.24.12.3l.06.07c.06.06.17.12.3.12h12.9V28.44Zm4 21.86 18.35 14.28V13.14L21.93 27.4v22.9Z"></path><g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-width="4" stroke-linecap="round"><path d="M51.68 27.75c7.37 6.75 8.07 14.09 0 22.2" class="AutoPlayBox__icon__blink"></path><path d="M60.92 18.05c13.65 15.58 11.9 29.21-.06 41.57" class="AutoPlayBox__icon__blink"></path><path d="M69.27 8.25c19.2 20.51 17.82 40.9.41 61.19" class="AutoPlayBox__icon__blink"></path><path d="m79.17 2.55-72.6 72.6"></path></g></svg>
            <p>Your Video is Playing <br /> Click to Unmute</p>
          </div>`;
  player.controlBar.el().insertAdjacentElement("beforebegin", myVideoBaner);
  //Запускаем видео и мутим
  player.muted(true); // Включаем режим без звука
  player.play();
  // ------------------------------------------------------------------------------------------

  // Получаем элементы интерфейса плеера
  const bigBtnPaues = document.querySelector(".vjs-big-play-button");
  bigBtnPaues.style.display = "none";
  const controlBar = document.querySelector(".vjs-control-bar");
  const containerVideo = document.querySelector("#containerVideo");
  const divVideo = document.querySelector(".my-video");
  const header = document.querySelector(".header");
  // ------------------------------------------------------------------------------------------

  // Создать кнопку перемотки
  const rewindButton = document.createElement("button");
  rewindButton.className = "vjs-rewind-button";
  rewindButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 20" width="22" height="20"><g stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" fill-rule="evenodd" fill="none"><path d="M5.67 7.1H1.58V3.03"></path><path d="M5.05 16.36a9 9 0 1 0 0-12.72L1.58 7.1"></path></g><path fill="currentColor" fill-rule="nonzero" d="M10.37 13h-1.2V9.15l.03-.6c-.2.2-.34.34-.42.4l-.66.53-.58-.73L9.38 7.3h1V13h-.01Zm5.55-2.86c0 1-.16 1.74-.5 2.22-.32.48-.82.72-1.5.72-.66 0-1.16-.25-1.5-.74a4 4 0 0 1-.5-2.2 4 4 0 0 1 .5-2.22c.32-.48.82-.72 1.5-.72.66 0 1.16.25 1.5.75a4 4 0 0 1 .5 2.2v-.01Zm-2.8 0c0 .7.07 1.2.19 1.51.12.3.32.46.6.46.29 0 .5-.16.62-.47.12-.3.19-.8.19-1.5s-.07-1.2-.2-1.5c-.12-.31-.32-.46-.6-.46-.28 0-.49.15-.61.46-.12.3-.18.8-.18 1.5h-.01Z"></path></svg>`; // Текст кнопки

  // Добавить кнопку в панель управления
  player.controlBar.progressControl
    .el()
    .insertAdjacentElement("beforebegin", rewindButton);

  // Добавить обработчик клика для перемотки на 10 секунд назад
  rewindButton.addEventListener("click", function () {
    const currentTime = player.currentTime();
    player.currentTime(Math.max(currentTime - 10, 0)); // Убедиться, что время не отрицательное
  });
  // ------------------------------------------------------------------------------------------

  // ------------------------------------------------------------------------------------------

  // Тут вешаем на видео обработчик события по клику и описываем нужную логику
  const videoElement = document.querySelector(".my-video");

  videoElement.addEventListener("click", handleClickVideo);

  let isDragging = false;

  videoElement.addEventListener("touchstart", (e) => {
    isDragging = false;
  });

  videoElement.addEventListener("touchmove", (e) => {
    isDragging = true;
  });

  videoElement.addEventListener("touchend", function () {
    if (!isDragging) {
      if (myVideoBaner.classList.contains("none")) {
        if (!player.paused()) {
          player.pause();
          // Показать большую кнопку воспроизведения
          containerVideo.classList.remove("top-container-full");
          divVideo.classList.remove("video-full");
          header.classList.remove("none");
          bigBtnPaues.style.display = "block";
          controlBar.style.display = "none";
          player.muted(false);
        } else {
          player.play();
          // Скрыть большую кнопку воспроизведения
          containerVideo.classList.add("top-container-full");
          divVideo.classList.add("video-full");
          header.classList.add("none");
          bigBtnPaues.style.display = "none";
          controlBar.style.display = "flex";
        }
      } else {
        myVideoBaner.classList.add("none");
        player.muted(false);
        player.play();
      }
    }
  });

  bigBtnPaues.addEventListener("touchend", function () {
    if (!isDragging) {
      if (myVideoBaner.classList.contains("none")) {
        if (!player.paused()) {
          player.pause();
          // Показать большую кнопку воспроизведения
          containerVideo.classList.remove("top-container-full");
          divVideo.classList.remove("video-full");
          header.classList.remove("none");
          bigBtnPaues.style.display = "block";
          controlBar.style.display = "none";
          player.muted(false);
        } else {
          player.play();
          // Скрыть большую кнопку воспроизведения
          containerVideo.classList.add("top-container-full");
          divVideo.classList.add("video-full");
          header.classList.add("none");
          bigBtnPaues.style.display = "none";
          controlBar.style.display = "flex";
        }
      } else {
        myVideoBaner.classList.add("none");
        player.muted(false);
        player.play();
      }
    }
  });

  function handleClickVideo() {
    if (myVideoBaner.classList.contains("none")) {
      if (player.paused()) {
        player.pause();
        // Показать большую кнопку воспроизведения
        containerVideo.classList.remove("top-container-full");
        divVideo.classList.remove("video-full");
        header.classList.remove("none");
        bigBtnPaues.style.display = "block";
        controlBar.style.display = "none";
        player.muted(false);
      } else {
        player.play();
        // Скрыть большую кнопку воспроизведения
        containerVideo.classList.add("top-container-full");
        divVideo.classList.add("video-full");
        header.classList.add("none");
        bigBtnPaues.style.display = "none";
        controlBar.style.display = "flex";
      }
    } else {
      myVideoBaner.classList.add("none");
      player.muted(false);
      player.play();
    }
  }

  // ------------------------------------------------------------------------------------------
});
