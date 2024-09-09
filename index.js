const participantsTrack = document.querySelector([`[datatype="track"]`]);
const totalParticipantsItems = participantsTrack.children.length;
const paginationScreen = document.querySelectorAll([
  `[datatype="pagination-screen"]`,
]);
const participantsLeftBtns = document.querySelectorAll([
  `[datatype="participant-pagination-left-btn"]`,
]);
const participantsRightBtns = document.querySelectorAll([
  `[datatype="participant-pagination-right-btn"]`,
]);
let currentParticipantsIndex = 0;
let isParticipantsTransitioning = false;
let isTransformationTransitioning = false;
const directions = { right: "right", left: "left" };

function getVisibleItems() {
  const width = window.innerWidth;
  const mobileScreens = 750;
  const tabletsScreens = 1280;
  const cardsQuantity = { one: 1, two: 2, three: 3 };

  if (width <= mobileScreens) {
    return cardsQuantity.one;
  } else if (width <= tabletsScreens) {
    return cardsQuantity.two;
  } else {
    return cardsQuantity.three;
  }
}

function updateItemWidth(track) {
  const visibleItems = getVisibleItems();
  return track.clientWidth / visibleItems;
}

function moveCarousel(track, initialIndex, isTransitioning, direction) {
  if (isTransitioning) return;
  isTransitioning = true;

  const visibleItems = getVisibleItems();
  const itemWidth = updateItemWidth(track);

  if (direction === directions.right) {
    initialIndex += visibleItems;
    track.style.transition = "transform 0.5s ease-in-out";
    track.style.transform = `translateX(${-itemWidth * initialIndex}px)`;
  } else if (direction === directions.left) {
    initialIndex -= visibleItems;
    track.style.transition = "transform 0.5s ease-in-out";
    track.style.transform = `translateX(${-itemWidth * initialIndex}px)`;
  }

  track.addEventListener("transitionend", () => {
    isTransitioning = false;
  });
  if (initialIndex >= track.children.length) {
    track.style.transition = "none";
    initialIndex = 0;
    track.style.transform = `translateX(0px)`;
  } else if (initialIndex < 0) {
    track.style.transition = "none";
    initialIndex = track.children.length - visibleItems;
    track.style.transform = `translateX(${-itemWidth * initialIndex}px)`;
  }
  return initialIndex;
}

function updatePagination(index = 1, totalItems) {
  const visibleItems = getVisibleItems();
  const endIndex = Math.min(index + visibleItems, totalItems);
  paginationScreen.forEach(
    item => (item.textContent = `${endIndex} / ${totalItems}`),
  );
}

function startCarousel() {
  const carouselInterval = 4000;
  setInterval(() => {
    currentParticipantsIndex = moveCarousel(
      participantsTrack,
      currentParticipantsIndex,
      isParticipantsTransitioning,
      directions.right,
    );
    updatePagination(currentParticipantsIndex, totalParticipantsItems);
  }, carouselInterval);
}

window.addEventListener("resize", () => {
  updatePagination(currentParticipantsIndex, totalParticipantsItems);
  updateItemWidth(participantsTrack);
});

startCarousel(participantsTrack);
updatePagination(currentParticipantsIndex, totalParticipantsItems);

function handleParticipantsLeftBtnClick() {
  currentParticipantsIndex = moveCarousel(
    participantsTrack,
    currentParticipantsIndex,
    isParticipantsTransitioning,
    directions.left,
  );
  updatePagination(currentParticipantsIndex, participantsTrack.children.length);
}

function handleParticipantsRightBtnClick() {
  currentParticipantsIndex = moveCarousel(
    participantsTrack,
    currentParticipantsIndex,
    isParticipantsTransitioning,
    directions.right,
  );
  updatePagination(currentParticipantsIndex, participantsTrack.children.length);
}

participantsRightBtns.forEach(item =>
  item.addEventListener("click", handleParticipantsRightBtnClick),
);

participantsLeftBtns.forEach(item =>
  item.addEventListener("click", handleParticipantsLeftBtnClick),
);

//--------------START Transformation Steps Carousel---------------//

const transformationTrack = document.querySelector([
  `[datatype="transformation-steps-track"]`,
]);
const transformationItems = document.querySelectorAll([
  `[datatype="transformation-track-item"]`,
]);
const rightButtonTransformation = document.querySelector([
  `[datatype="transformation-right-btn"]`,
]);
const leftButtonTransformation = document.querySelector([
  `[datatype="transformation-left-btn"]`,
]);
let activeTransformationIndex = 0;
const transformationCirclesWrapper = document.querySelector([
  `[datatype="transformation-pagination-circles"]`,
]);

function setActivePaginationCircle() {
  Array.from(transformationCirclesWrapper.children).forEach((item, index) => {
    if (index === activeTransformationIndex) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

function handleRightBtnTransformationClick(e) {
  activeTransformationIndex = moveCarousel(
    transformationTrack,
    activeTransformationIndex,
    isTransformationTransitioning,
    directions.right,
  );
  leftButtonTransformation.classList.remove("disabled");
  if (activeTransformationIndex === transformationItems.length) {
    e.target.classList.add("disabled");
  }
  setActivePaginationCircle();
}

function handleLeftBtnTransformationClick(e) {
  activeTransformationIndex = moveCarousel(
    transformationTrack,
    activeTransformationIndex,
    isTransformationTransitioning,
    directions.left,
  );
  rightButtonTransformation.classList.remove("disabled");
  if (activeTransformationIndex === 0) {
    e.target.classList.add("disabled");
  }
  setActivePaginationCircle();
}

Array.from(transformationTrack.children).forEach((_, index) => {
  const circleDiv = document.createElement("div");
  transformationCirclesWrapper.append(circleDiv);
  circleDiv.classList.add(
    "transformation-circle-pagination",
    "pagination-circle",
  );
  if (index === 0) {
    circleDiv.classList.add("active");
  }
});
rightButtonTransformation.addEventListener("click", e =>
  handleRightBtnTransformationClick(e),
);

leftButtonTransformation.addEventListener("click", e =>
  handleLeftBtnTransformationClick(e),
);

//--------------END Transformation Steps Carousel---------------//
