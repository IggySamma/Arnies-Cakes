const form = document.getElementById("form");

form.addEventListener("submit", submitForm);

function submitForm(file) {
    file.preventDefault();
    const name = document.getElementById("select-box");
    const files = document.getElementById("files");
    const formData = new FormData();
    formData.append("name", name.value);
    for(let i =0; i < files.files.length; i++) {
            formData.append("myFiles", files.files[i]);
    }
    fetch("/api/upload", {
        method: 'POST',
        body: formData,
    })
        //.then((res) => console.log(res))
        //.catch((err) => ("Error occured", err));
}


/* Need to make a connection so I can query from sql server the paths */