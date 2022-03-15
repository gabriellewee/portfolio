let illo = new Zdog.Illustration({
	element: ".totem",
	dragRotate: true
});

let anchor = new Zdog.Anchor({
	addTo: illo,
	rotate: { x: -Zdog.TAU / 24, y: Zdog.TAU * .66 }
});

// groups
let one = new Zdog.Anchor({
	addTo: anchor,
	translate: { y: -216 }
});

let two = new Zdog.Anchor({
	addTo: anchor,
	translate: { y: -108 }
});

let three = new Zdog.Anchor({
	addTo: anchor,
	translate: { y: 0 }
});

let four = new Zdog.Anchor({
	addTo: anchor,
	translate: { y: 108 }
});

// shared
let sharedTopBottom = {
	width: 96,
	height: 96,
	color: "#FDAA4E",
	fill: true
}

let sharedTopGroup = {
	rotate: { x: Zdog.TAU / 4 }
}

let sharedBottomGroup = {
	rotate: { x: Zdog.TAU / 4 },
	translate: { y: 96 }
}

let sharedFrontGroup = {
	translate: { x: -48, y: 48 },
	rotate: { y: -Zdog.TAU / 4 }
}

let sharedBackGroup = {
	translate: { x: 48, y: 48 },
	rotate: { y: -Zdog.TAU / 4 }
}

let sharedLeftRight = {
	width: 96,
	height: 96,
	color: "#FED240",
	fill: true
}

let sharedLeftGroup = {
	translate: { y: 48, z: -48 }
}

let sharedRightGroup = {
	translate: { y: 48, z: 48 }
}

let sharedEye = {
	diameter: 72,
	color: "#FFFFF9",
	fill: true
}

let sharedPupil = {
	diameter: 48,
	color: "#9F355A",
	fill: true
}

let sharedLeftRightBorderOne = {
	width: 84,
	height: 84,
	color: "#C2C9CC",
	fill: true,
	translate: { x: -6, y: 6 }
}

let sharedLeftRightBorderTwo = {
	width: 72,
	height: 72,
	color: "#FED240",
	fill: true,
	translate: { x: -12, y: 12 }
}

let sharedLeftRightBorderThree = {
	width: 60,
	height: 60,
	color: "#C2C9CC",
	fill: true,
	translate: { x: -18, y: 18 }
}

let sharedLeftRightBorderFour = {
	width: 48,
	height: 48,
	color: "#FED240",
	fill: true,
	translate: { x: -24, y: 24 }
}

let sharedLeftRightBorderFive = {
	width: 36,
	height: 36,
	color: "#C2C9CC",
	fill: true,
	translate: { x: -30, y: 30 }
}

let sharedLeftRightBorderSix = {
	width: 24,
	height: 24,
	color: "#FED240",
	fill: true,
	translate: { x: -36, y: 36 }
}

let sharedFrontBack = {
	width: 96,
	height: 96,
	color: "#FEF440",
	fill: true
}

let sharedButton = {
	diameter: 48,
	length: 6,
	color: "#FDAE56",
	frontFace: false,
	backface: "#FEEE57",
	fill: true,
	translate: { z: -4 }
}

let sharedButtonInside = {
	diameter: 24,
	color: "#EF9355",
	fill: true,
	translate: { z: -6 }
}

// cube one
let oneTopGroup = new Zdog.Group(Zdog.extend(sharedTopGroup, { addTo: one }));

let oneTop = new Zdog.Rect(Zdog.extend(sharedTopBottom, { addTo: oneTopGroup, color: "#FFFD68" }));

let oneTopBorder = new Zdog.Rect({
	addTo: oneTopGroup,
	width: 84,
	height: 72,
	color: "#E4FFFF",
	fill: true,
	translate: { x: 6 }
});

let oneTopBorderCenter = new Zdog.Rect({
	addTo: oneTopGroup,
	width: 72,
	height: 48,
	color: "#FFFD68",
	fill: true,
	translate: { x: 12 }
});

let oneTopBorderInside = new Zdog.Rect({
	addTo: oneTopGroup,
	width: 60,
	height: 24,
	color: "#E4FFFF",
	fill: true,
	translate: { x: 18 }
});

let oneBottomGroup = new Zdog.Group(Zdog.extend(sharedBottomGroup, { addTo: one }));

let oneBottom = new Zdog.Rect(Zdog.extend(sharedTopBottom, { addTo: oneBottomGroup, color: "#FDA13E" }));

let oneLeftGroup = new Zdog.Group(Zdog.extend(sharedLeftGroup, { addTo: one }));

let oneLeft = new Zdog.Rect(Zdog.extend(sharedLeftRight, { addTo: oneLeftGroup }));

let oneLeftEye = new Zdog.Ellipse(Zdog.extend(sharedEye, { addTo: oneLeftGroup }));

let oneLeftPupil = new Zdog.Ellipse(Zdog.extend(sharedPupil, { addTo: oneLeftGroup }));

let oneRightGroup = new Zdog.Group(Zdog.extend(sharedRightGroup, { addTo: one }));

let oneRight = new Zdog.Rect(Zdog.extend(sharedLeftRight, { addTo: oneRightGroup }));

let oneRightEye = oneLeftEye.copy({
	addTo: oneRightGroup
});

let oneRightPupil = oneLeftPupil.copy({
	addTo: oneRightGroup
});

let oneFrontGroup = new Zdog.Group(Zdog.extend(sharedFrontGroup, { addTo: one }));

let oneFront = new Zdog.Rect(Zdog.extend(sharedFrontBack, { addTo: oneFrontGroup }));

let oneFrontBorder = new Zdog.Rect({
	addTo: oneFrontGroup,
	width: 72,
	height: 84,
	color: "#D7ECE4",
	fill: true,
	translate: { y: 6 }
});

let oneFrontBorderInside = new Zdog.Rect({
	addTo: oneFrontGroup,
	width: 48,
	height: 72,
	color: "#FEF440",
	fill: true,
	translate: { y: 12 }
});

let oneBackGroup = new Zdog.Group(Zdog.extend(sharedBackGroup, { addTo: one }));

let oneBack = new Zdog.Rect(Zdog.extend(sharedFrontBack, { addTo: oneBackGroup }));

let oneBackBorderOne = new Zdog.Shape({
	addTo: oneBackGroup,
	path: [
		{ x: 12, y: 0 },
		{ x: 84, y: 0 },
		{ x: 48, y: 84 }
	],
	closed: true,
	fill: true,
	color: '#D7ECE4',
	translate: { x: -48, y: -48 }
});

let oneBackBorderTwo = new Zdog.Shape({
	addTo: oneBackGroup,
	path: [
		{ x: 24, y: 0 },
		{ x: 72, y: 0 },
		{ x: 48, y: 56 }
	],
	closed: true,
	fill: true,
	color: '#FEF440',
	translate: { x: -48, y: -48 }
});

let oneBackBorderThree = new Zdog.Shape({
	addTo: oneBackGroup,
	path: [
		{ x: 36, y: 0 },
		{ x: 60, y: 0 },
		{ x: 48, y: 28 }
	],
	closed: true,
	fill: true,
	color: '#D7ECE4',
	translate: { x: -48, y: -48 }
});

// cube 2
let twoTopGroup = oneTopGroup.copy({
	addTo: two
});

let twoTop = oneBottom.copy({
	addTo: twoTopGroup,
	color: '#FDAA4E'
});

let twoBottomGroup = oneBottomGroup.copy({
	addTo: two
});

let twoBottom = oneBottom.copy({
	addTo: twoBottomGroup,
	color: '#FDA13E'
});

let twoLeftGroup = oneLeftGroup.copy({
	addTo: two
});

let twoLeft = oneLeft.copy({
	addTo: twoLeftGroup
});

let twoLeftBorderOne = new Zdog.Rect(Zdog.extend(sharedLeftRightBorderOne, { addTo: twoLeftGroup }));

let twoLeftBorderTwo = new Zdog.Rect(Zdog.extend(sharedLeftRightBorderTwo, { addTo: twoLeftGroup }));

let twoLeftBorderThree = new Zdog.Rect(Zdog.extend(sharedLeftRightBorderThree, { addTo: twoLeftGroup }));

let twoLeftBorderFour = new Zdog.Rect(Zdog.extend(sharedLeftRightBorderFour, { addTo: twoLeftGroup }));

let twoLeftBorderFive = new Zdog.Rect(Zdog.extend(sharedLeftRightBorderFive, { addTo: twoLeftGroup }));

let twoLeftBorderSix = new Zdog.Rect(Zdog.extend(sharedLeftRightBorderSix, { addTo: twoLeftGroup }));

let twoRightGroup = oneRightGroup.copy({
	addTo: two
});

let twoRight = oneRight.copy({
	addTo: twoRightGroup
});

let twoRightBorderOne = twoLeftBorderOne.copy({
	addTo: twoRightGroup
});

let twoRightBorderTwo = twoLeftBorderTwo.copy({
	addTo: twoRightGroup
});

let twoRightBorderThree = twoLeftBorderThree.copy({
	addTo: twoRightGroup
});

let twoRightBorderFour = twoLeftBorderFour.copy({
	addTo: twoRightGroup
});

let twoRightBorderFive = twoLeftBorderFive.copy({
	addTo: twoRightGroup
});

let twoRightBorderSix = twoLeftBorderSix.copy({
	addTo: twoRightGroup
});

let twoFrontGroup = oneFrontGroup.copy({
	addTo: two
});

let twoFront = oneFront.copy({
	addTo: twoFrontGroup
});

let twoFrontBorderOne = new Zdog.Rect({
	addTo: twoFrontGroup,
	width: 96,
	height: 84,
	color: "#CAE7DE",
	fill: true,
	translate: { y: 6 }
});

let twoFrontBorderTwo = new Zdog.Rect({
	addTo: twoFrontGroup,
	width: 96,
	height: 72,
	color: "#FEF440",
	fill: true,
	translate: { y: 12 }
});

let twoFrontBorderThree = new Zdog.Rect({
	addTo: twoFrontGroup,
	width: 96,
	height: 60,
	color: "#CAE7DE",
	fill: true,
	translate: { y: 18 }
});

let twoFrontBorderFour = new Zdog.Rect({
	addTo: twoFrontGroup,
	width: 96,
	height: 48,
	color: "#FEF440",
	fill: true,
	translate: { y: 24 }
});

let twoFrontBorderFive = new Zdog.Rect({
	addTo: twoFrontGroup,
	width: 96,
	height: 36,
	color: "#CAE7DE",
	fill: true,
	translate: { y: 30 }
});

let twoFrontBorderSix = new Zdog.Rect({
	addTo: twoFrontGroup,
	width: 96,
	height: 24,
	color: "#FEF440",
	fill: true,
	translate: { y: 36 }
});

let twoFrontBorderSeven = new Zdog.Rect({
	addTo: twoFrontGroup,
	width: 12,
	height: 24,
	color: "#FEF440",
	fill: true,
	translate: { y: 12 }
});

let twoBackGroup = oneBackGroup.copy({
	addTo: two
});

let twoBack = oneBack.copy({
	addTo: twoBackGroup
});

let twoBackBorderOne = new Zdog.Shape({
	addTo: twoBackGroup,
	path: [
		{ x: 0, y: 72 },
		{ x: 0, y: 96 },
		{ x: 12, y: 96 }
	],
	closed: true,
	fill: true,
	color: '#D7ECE4',
	translate: { x: -48, y: -48 }
});

let twoBackBorderTwo = new Zdog.Shape({
	addTo: twoBackGroup,
	path: [
		{ x: 96, y: 72 },
		{ x: 96, y: 96 },
		{ x: 84, y: 96 }
	],
	closed: true,
	fill: true,
	color: '#D7ECE4',
	translate: { x: -48, y: -48 }
});

let twoBackBorderThree = new Zdog.Shape({
	addTo: twoBackGroup,
	path: [
		{ x: 0, y: 16 },
		{ x: 0, y: 46 },
		{ x: 25, y: 96 },
		{ x: 40, y: 96 }
	],
	closed: true,
	fill: true,
	color: '#D7ECE4',
	translate: { x: -48, y: -48 }
});

let twoBackBorderFour = new Zdog.Shape({
	addTo: twoBackGroup,
	path: [
		{ x: 96, y: 16 },
		{ x: 96, y: 46 },
		{ x: 71, y: 96 },
		{ x: 56, y: 96 }
	],
	closed: true,
	fill: true,
	color: '#D7ECE4',
	translate: { x: -48, y: -48 }
});

let twoBackBorderFive = new Zdog.Shape({
	addTo: twoBackGroup,
	path: [
		{ x: 12, y: 12 },
		{ x: 84, y: 12 },
		{ x: 78, y: 24 },
		{ x: 18, y: 24 }
	],
	closed: true,
	fill: true,
	color: '#D7ECE4',
	translate: { x: -48, y: -48 }
});

let twoBackBorderSix = new Zdog.Shape({
	addTo: twoBackGroup,
	path: [
		{ x: 24, y: 36 },
		{ x: 72, y: 36 },
		{ x: 66, y: 48 },
		{ x: 30, y: 48 }
	],
	closed: true,
	fill: true,
	color: '#D7ECE4',
	translate: { x: -48, y: -48 }
});

let twoBackBorderSeven = new Zdog.Shape({
	addTo: twoBackGroup,
	path: [
		{ x: 36, y: 60 },
		{ x: 60, y: 60 },
		{ x: 48, y: 84 }
	],
	closed: true,
	fill: true,
	color: '#D7ECE4',
	translate: { x: -48, y: -48 }
});

// cube 3
let threeTopGroup = oneTopGroup.copy({
	addTo: three
});

let threeTop = oneBottom.copy({
	addTo: threeTopGroup,
	color: '#FDAA4E'
});

let threeBottomGroup = oneBottomGroup.copy({
	addTo: three
});

let threeBottom = oneBottom.copy({
	addTo: threeBottomGroup,
	color: '#FDA13E'
});

let threeLeftGroup = oneLeftGroup.copy({
	addTo: three
});

let threeLeft = oneLeft.copy({
	addTo: threeLeftGroup
});

let threeLeftButton = new Zdog.Cylinder(Zdog.extend(sharedButton, { addTo: threeLeftGroup }));

let threeLeftButtonInside = new Zdog.Ellipse(Zdog.extend(sharedButtonInside, { addTo: threeLeftGroup }));

let threeRightGroup = oneRightGroup.copy({
	addTo: three
});

let threeRight = oneRight.copy({
	addTo: threeRightGroup
});

let threeRightButton = threeLeftButton.copy({
	addTo: threeRightGroup,
	translate: { z: 4 }
});

let threeRightButtonInside = threeLeftButtonInside.copy({
	addTo: threeRightGroup,
	translate: { z: 6 }
});

let threeFrontGroup = oneFrontGroup.copy({
	addTo: three
});

let threeFront = oneFront.copy({
	addTo: threeFrontGroup
});

let threeFrontBorderOne = new Zdog.Rect({
	addTo: threeFrontGroup,
	width: 72,
	height: 96,
	color: "#CAE7DE",
	fill: true
});

let threeFrontBorderTwo = new Zdog.Rect({
	addTo: threeFrontGroup,
	width: 48,
	height: 72,
	color: "#FEF440",
	fill: true
});

let threeFrontBorderThree = new Zdog.Rect({
	addTo: threeFrontGroup,
	width: 72,
	height: 12,
	color: "#FEF440",
	fill: true,
	translate: { y: 30 }
});

let threeFrontBorderFour = new Zdog.Rect({
	addTo: threeFrontGroup,
	width: 24,
	height: 72,
	color: "#CAE7DE",
	fill: true,
	translate: { y: 12 }
});

let threeBackGroup = oneBackGroup.copy({
	addTo: three
});

let threeBack = oneBack.copy({
	addTo: threeBackGroup
});

let threeBackBorder = new Zdog.Rect({
	addTo: threeBackGroup,
	width: 72,
	height: 84,
	color: "#D7ECE4",
	fill: true,
	translate: { y: -6 }
});

let threeBackBorderCenter = new Zdog.Rect({
	addTo: threeBackGroup,
	width: 48,
	height: 72,
	color: "#FEF440",
	fill: true,
	translate: { y: -12 }
});

let threeBackBorderInside = new Zdog.Rect({
	addTo: threeBackGroup,
	width: 24,
	height: 60,
	color: "#D7ECE4",
	fill: true,
	translate: { y: -18 }
});

// cube 4
let fourTopGroup = oneTopGroup.copy({
	addTo: four
});

let fourTop = oneBottom.copy({
	addTo: fourTopGroup,
	color: '#FDAA4E'
});

let fourBottomGroup = oneBottomGroup.copy({
	addTo: four
});

let fourBottom = oneBottom.copy({
	addTo: fourBottomGroup,
	color: '#FDA13E'
});

let fourLeftGroup = oneLeftGroup.copy({
	addTo: four
});

let fourLeft = oneLeft.copy({
	addTo: fourLeftGroup
});

let fourLeftButton = new Zdog.Cylinder(Zdog.extend(sharedButton, { addTo: fourLeftGroup }));

let fourLeftButtonInside = new Zdog.Ellipse(Zdog.extend(sharedButtonInside, { addTo: fourLeftGroup }));

let fourRightGroup = oneRightGroup.copy({
	addTo: four
});

let fourRight = oneRight.copy({
	addTo: fourRightGroup
});

let fourFrontGroup = oneFrontGroup.copy({
	addTo: four
});

let fourRightButton = threeRightButton.copy({
	addTo: fourRightGroup
});

let fourRightButtonInside = threeRightButtonInside.copy({
	addTo: fourRightGroup
});

let fourFront = oneFront.copy({
	addTo: fourFrontGroup
});

let fourFrontButton = fourLeftButton.copy({
	addTo: fourFrontGroup,
	color: "#FDAA55",
	backface: "#FFFD60"
});

let fourFrontButtonInside = fourLeftButtonInside.copy({
	addTo: fourFrontGroup,
	color: "#FDAA55"
});

let fourBackGroup = oneBackGroup.copy({
	addTo: four
});

let fourBack = oneBack.copy({
	addTo: fourBackGroup
});

let fourBackButton = fourFrontButton.copy({
	addTo: fourBackGroup,
	translate: { z: 4 }
});

let fourBackButtonInside = fourFrontButtonInside.copy({
	addTo: fourBackGroup,
	translate: { z: 6 }
});


// render
illo.updateRenderGraph();

function animate() {
	illo.updateRenderGraph();
	requestAnimationFrame(animate);
}

animate();