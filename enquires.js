function updatePlaceholder(id) {
    const incrementCheckBox = document.getElementById(id + "1");
    if (document.getElementById(id).checked) {
        incrementCheckBox.setAttribute("placeholder", "1");
        incrementCheckBox.value = "1";
        incrementCheckBox.disabled = false;
    } else {
        incrementCheckBox.setAttribute("placeholder", "0");
        incrementCheckBox.value = "0";
        incrementCheckBox.disabled = true;
    }
}

