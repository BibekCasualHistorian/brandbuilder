function insertElementAtPosition(allDocuments, indexToPop, newIndex) {
  const arrayToModify = allDocuments;
  const poppedElement = arrayToModify.splice(indexToPop, 1)[0];

  const finalPosition = Math.min(Math.max(0, newIndex), arrayToModify.length);

  arrayToModify.splice(finalPosition, 0, poppedElement);

  console.log("arrayToModify", arrayToModify);
  return arrayToModify;
}

module.exports = insertElementAtPosition;
