
let sortingState = [];
let counterStep = 0;
let nextStepsAndPrevious = 0
let sortingStateWithSteps = {};
let backtraceFlag = false; // trace the tree back (form the sorted arrays)
let leftBranchElements = {};
let rightBranchElements = {};

function initializeSortingStates() {
    return {
        'visualize': {
            'leftBlock': [],
            'rightBlock': []
        },
        'sorted': {
            'leftBlock': [],
            'rightBlock': []
        }
    }
}

function addArrayToDisplay(miniContainer, array, boxType, elementClassname='classArray') {

    if (!array || !array.length) {
        const box = document.createElement("div");
        box.classList.add(boxType);
        miniContainer.appendChild(box);
    } else {
        // this function helps to add arrays div in our display
        for (let i = 0; i < array.length; i++) {
            const box = document.createElement("div");
            box.classList.add(boxType);
            box.textContent = array[i];
            miniContainer.appendChild(box);
        }
    }
    miniContainer.classList.add(elementClassname);
    return miniContainer;
}

// Function to display an array in HTML
function createArrayDivToDisplay(array, step, branchSide) {
    const miniContainer = document.createElement("div");
    sortingState.push(addArrayToDisplay(miniContainer, array, 'box'));
    // we need to initialize it if not done yet, so we can have a dynamic object (as many entries as needed)
    if (!sortingStateWithSteps[step]) {
        sortingStateWithSteps[step] = initializeSortingStates();
    }
    sortingStateWithSteps[step]['visualize'][branchSide].push(array);
}

function createSortedArrayDivToDisplay(array, step, branchSide) {
    const miniContainer = document.createElement("div");
    sortingState.push(addArrayToDisplay(miniContainer, array, 'resultBox'));
    if (!sortingStateWithSteps[step]) {
        sortingStateWithSteps[step] = initializeSortingStates();
    }
    // put the sorted array at the step before e.g if in step 2 we have 1, 3, 5 sorted put this on step 1 for visualization
    if (step - 1 < 0) {
        sortingStateWithSteps[0]['sorted'][branchSide].push(array);
    } else {
        sortingStateWithSteps[(step - 1).toString()]['sorted'][branchSide].push(array);
    }
}

function mergeSort(array, left, right, step, middlePointWhereBranchSplit) {

    // decide if it is a left or right branch based on middle
    // when we display the left and right block we will get the odd numbers index (in the sorted array)
    // for left branch and even numbers for right branch of leftBranch and rightBranch objects
    // Note: that leftBranch and rightBranch are for every level of the tree (Breadth First Search (BFS) Visualization)
    let branchSide = 'leftBlock' // left branch
    // compute the middle point to split the array
    const middle = Math.floor((right - left) / 2) + left;
    if (middle > middlePointWhereBranchSplit) {
        branchSide = 'rightBlock';
    }

    createArrayDivToDisplay(array.slice(left, right + 1), step, branchSide);

    if (left >= right) {
        return step;
    }

    step++;
    mergeSort(array, left, middle, step, middle);
    mergeSort(array, middle + 1, right, step, middle);

    let index1 = left;
    let index2 = middle + 1;

    const newArray = [];

    while (index1 <= middle && index2 <= right) {
        if (array[index1] < array[index2]) {
            newArray.push(array[index1]);
            index1++;
        } else {
            newArray.push(array[index2]);
            index2++;
        }
    }
    console.log(newArray);

    while (index1 <= middle) {
        newArray.push(array[index1]);
        index1++;
    }
    console.log(newArray);

    while (index2 <= right) {
        newArray.push(array[index2]);
        index2++;
    }
    console.log(newArray);

    for (let j = left; j <= right; j++) {
        array[j] = newArray[j - left];
    }

    // console.log('Step - ', step ,' New Array: ', newArray);
    createSortedArrayDivToDisplay(newArray, step, branchSide);

    // remove empty / undefined values in the object
    // Object.keys(sortingStateWithSteps).forEach(key => sortingStateWithSteps[key] === undefined ? delete sortingStateWithSteps[key] : {});
    console.log('Sorted Tree : ', sortingStateWithSteps);
}

function getInputValueNumber() {
    const inputValue = document.getElementById('input').value.trim();
    let inputNumbers = inputValue.trim().split(',');
    inputNumbers.map(element => Number(element.trim()));
    for(let i=0;i<inputNumbers.length;i++){
        inputNumbers[i] = +inputNumbers[i];
    }
    return inputNumbers;
}

document.getElementById('sort').addEventListener('click', () => {
    try {
        let inputNumbers = getInputValueNumber();
        document.getElementById('input').value = inputNumbers.join(',');
        const middlePointWhereBranchSplit = Math.floor((inputNumbers.length - 1) / 2);
        mergeSort(inputNumbers, 0, inputNumbers.length - 1, 0, middlePointWhereBranchSplit);
        document.getElementById("array-container-start").appendChild(sortingState[0]);
        counterStep++;
        console.log('Sorted. Starting Visualization...')
    } catch (error) {
        alert('Please input only numbers!');
        console.error(error);
    }
});

document.getElementById('nextStep').addEventListener('click', () => {
    if (counterStep === sortingState.length) return;
    if (!backtraceFlag) {
        if (!sortingStateWithSteps[counterStep] || (sortingStateWithSteps[counterStep]['sorted']['leftBlock'] === []
            && sortingStateWithSteps[counterStep]['sorted']['rightBlock'] === [])) {
            backtraceFlag = true;
            counterStep--; // decrement index as we display the sorted array from the last row till the first one (sorted)
            return;
        }
        nextStepsAndPrevious++;

        if (counterStep === 0) {
            return counterStep++;
        }

        const elementsLeft = sortingStateWithSteps[counterStep]['visualize']['leftBlock']
        const elementsRight = sortingStateWithSteps[counterStep]['visualize']['rightBlock']

        // Get elements for left branch first (including right branches of left branch itself)
        // get elements of right branch (including left branches of right branch somehow)
        const leftBranch = [];
        const rightBranch = [];

        // means 2 pairs (one for left branch one for right branch otherwise we have 3 numbers hmm :)
        if (counterStep > 1) {
            let iterateThroughElementWithBiggerLength = elementsRight;
            if (elementsLeft.length >= elementsRight.length) {
                iterateThroughElementWithBiggerLength = elementsLeft;
            }
            iterateThroughElementWithBiggerLength.forEach((element, index) => {
                if (iterateThroughElementWithBiggerLength.length >= 4) {
                    // index 0 and 1 will correspond to left branch (This was proven by our experiments)
                    if (index < iterateThroughElementWithBiggerLength.length / 2) {
                        // coming from right branch
                        elementsLeft[index] && leftBranch.push(elementsLeft[index]);
                        elementsRight[index] && leftBranch.push(elementsRight[index]);
                    } else {
                        elementsLeft[index] && rightBranch.push(elementsLeft[index]);
                        elementsRight[index] && rightBranch.push(elementsRight[index]);
                    }
                } else {
                    if (index % 2 === 0) {
                        // coming from right branch
                        elementsLeft[index] && leftBranch.push(elementsLeft[index]);
                        elementsRight[index] && leftBranch.push(elementsRight[index]);
                    } else {
                        elementsLeft[index] && rightBranch.push(elementsLeft[index]);
                        elementsRight[index] && rightBranch.push(elementsRight[index]);
                    }
                }

            });
        } else {
            if (elementsLeft.length === 1) {
                leftBranch.push(elementsLeft[0])
            }

            if (elementsRight.length === 1) {
                rightBranch.push(elementsRight[0])
            }
        }

        console.log('elementsLeft: ', elementsLeft);
        console.log('elementsRight: ', elementsRight);
        console.log('LeftBranch: ', leftBranch);
        console.log('RightBranch: ', rightBranch);
        console.log()
        leftBranchElements[nextStepsAndPrevious] = leftBranch;
        rightBranchElements[nextStepsAndPrevious] = rightBranch;

        if (leftBranchElements[nextStepsAndPrevious - 1]
            && leftBranchElements[nextStepsAndPrevious].length <= leftBranchElements[nextStepsAndPrevious - 1].length) {
            // append old elements to left branch array (i.e elements of length 1) so we can display them on the row
            leftBranchElements[nextStepsAndPrevious - 1].forEach(element => {
                element.length === 1 && leftBranch.push(element);
            });
        }
        if (rightBranchElements[nextStepsAndPrevious - 1]
            && rightBranchElements[nextStepsAndPrevious].length <= rightBranchElements[nextStepsAndPrevious - 1].length) {
            // append old elements to right branch array (elements of length 1) so we can display them on the row
            rightBranchElements[nextStepsAndPrevious - 1].forEach(element => {
                element.length === 1 && rightBranch.push(element);
            });
        }


        const displayElementOnRowLeft = addArrayToDisplay(document.createElement("div"), leftBranch, 'box', nextStepsAndPrevious.toString())
        const displayElementOnRowRight = addArrayToDisplay(document.createElement("div"), rightBranch, 'box', nextStepsAndPrevious.toString())
        document.getElementById("array-container-left").appendChild(displayElementOnRowLeft);
        document.getElementById("array-container-right").appendChild(displayElementOnRowRight);
        counterStep++;

        if (!sortingStateWithSteps[counterStep] || (sortingStateWithSteps[counterStep]['sorted']['leftBlock'] === []
            && sortingStateWithSteps[counterStep]['sorted']['rightBlock'] === [])) {
            backtraceFlag = true;
            counterStep--; // decrement index as we display the sorted array from the last row till the first one (sorted)
        }

    } else {
        console.log('Display sorted now (Backtrace)');

        counterStep--
        if (counterStep < 0) {
            const sortedElement = sortingStateWithSteps[0]['sorted']['leftBlock'][1] || sortingStateWithSteps[0]['sorted']['leftBlock'][0]
            const displayElementOnRowLeft = addArrayToDisplay(document.createElement("div"), sortedElement, 'resultBox', nextStepsAndPrevious.toString())
            document.getElementById("array-container-end").appendChild(displayElementOnRowLeft);

            // I could have merged these 2 if statements together but this adds a small timeout so the alert fires after the sorted array is displayed

            alert('This was the final step of sorting. Use previous to iterate')
            return;
        }

        nextStepsAndPrevious++;
        console.log(counterStep, sortingStateWithSteps);

        let elementsLeft = sortingStateWithSteps[counterStep]['sorted']['leftBlock']
        let elementsRight = sortingStateWithSteps[counterStep]['sorted']['rightBlock']

        if (!elementsLeft.length && !elementsRight.length) {
            counterStep--;
            elementsLeft = sortingStateWithSteps[counterStep]['sorted']['leftBlock']
            elementsRight = sortingStateWithSteps[counterStep]['sorted']['rightBlock']
        }

        if (elementsLeft.length > 1) {
            // TODO: There is a bug somewhere which is adding the final sorted array both to step 1 and to step 0
            // I removed 1 of them
            elementsLeft = elementsLeft.filter(function(item) {
                return item.length !== getInputValueNumber().length;
            })
        }

        if (elementsRight.length > 1) {
            // TODO: There is a bug somewhere which is adding the final sorted array both to step 1 and to step 0
            // I removed 1 of them
            elementsRight = elementsRight.filter(function(item) {
                return item.length !== getInputValueNumber().length;
            })
        }

        // Get elements for left branch first (including right branches of left branch itself)
        // get elements of right branch (including left branches of right branch somehow)
        const leftBranch = [];
        const rightBranch = [];

        // means 2 pairs (one for left branch one for right branch otherwise we have 3 numbers hmm :)
        if (elementsLeft.length % 2 === 0) {
            elementsLeft.forEach((element, index) => {
                if (index % 2 === 0) {
                    leftBranch.push(element)
                } else {
                    rightBranch.push(element)
                }
            });
        } else {
            if (elementsLeft.length === 1) {
                leftBranch.push(elementsLeft[0])
            }
        }

        if (elementsRight.length % 2 === 0) {
            elementsRight.forEach((element, index) => {
                if (index % 2 === 0) {
                    leftBranch.push(element)
                } else {
                    rightBranch.push(element)
                }
            });
        } else {
            if (elementsRight.length === 1) {
                rightBranch.push(elementsRight[0])
            }
        }

        console.log('elementsRight: ', elementsRight);
        console.log('RightBranch: ', rightBranch);
        console.log('elementsLeft: ', elementsLeft);
        console.log('LeftBranch: ', leftBranch);
        console.log();
        leftBranchElements[nextStepsAndPrevious] = leftBranch;
        rightBranchElements[nextStepsAndPrevious] = rightBranch;

        /* if ((leftBranch && leftBranch[0].length !== getInputValueNumber().length) || (rightBranch && rightBranch[0].length !== getInputValueNumber().length)) {
            const sortedElement = sortingStateWithSteps[0]['sorted']['leftBlock'][1] || sortingStateWithSteps[0]['sorted']['leftBlock'][0]
            const displayElementOnRowLeft = addArrayToDisplay(document.createElement("div"), sortedElement, 'resultBox', nextStepsAndPrevious.toString())
            document.getElementById("array-container-end").appendChild(displayElementOnRowLeft);
            counterStep = -1;
            alert('This was the final step of sorting. Use previous to iterate')
            return;
        } */

        if (leftBranchElements[nextStepsAndPrevious - 1]
            && leftBranchElements[nextStepsAndPrevious].length <= leftBranchElements[nextStepsAndPrevious - 1].length) {
            // append old elements to left branch array (i.e elements of length 1) so we can display them on the row
            const removeThisDuplicatesOnly = [];
            leftBranchElements[nextStepsAndPrevious - 1].forEach(element => {
                let includesElement = false;
                element && element.length === 1 && !removeThisDuplicatesOnly.includes(element[0]) && leftBranch.forEach(left => {
                    if (left.includes(element[0])) {
                        includesElement = true;
                        removeThisDuplicatesOnly.push(element[0]);
                    }
                })
                element && element.length === 1 && !includesElement && leftBranch.push(element);
            });
        }
        if (rightBranchElements[nextStepsAndPrevious - 1]
            && rightBranchElements[nextStepsAndPrevious].length <= rightBranchElements[nextStepsAndPrevious - 1].length) {
            // append old elements to right branch array (elements of length 1) so we can display them on the row
            const removeThisDuplicatesOnly = [];
            rightBranchElements[nextStepsAndPrevious - 1].forEach(element => {
                let includesElement = false;
                element && element.length === 1 && !removeThisDuplicatesOnly.includes(element[0])  && rightBranch.forEach(rights => {
                    if (rights.includes(element[0])) {
                        includesElement = true;
                        removeThisDuplicatesOnly.push(element[0]);
                    }
                })
                element.length === 1 && !includesElement && rightBranch.push(element);
            });
        }

        const displayElementOnRowLeft = addArrayToDisplay(document.createElement("div"), leftBranch, 'box', nextStepsAndPrevious.toString())
        const displayElementOnRowRight = addArrayToDisplay(document.createElement("div"), rightBranch, 'box', nextStepsAndPrevious.toString())
        document.getElementById("array-container-left").appendChild(displayElementOnRowLeft);
        document.getElementById("array-container-right").appendChild(displayElementOnRowRight);
    }

});

document.getElementById('prevStep').addEventListener('click', () => {
    if (nextStepsAndPrevious === 0) return;
    [...document.getElementsByClassName(nextStepsAndPrevious.toString())].map(n => n && n.remove());
    if (backtraceFlag) {
        if (counterStep < 0) {
            counterStep += 2;
        } else {
            counterStep++;
        }
    } else {
        counterStep--;
    }

});

document.getElementById('clear').addEventListener('click', () => {
    window.location.reload();
});
