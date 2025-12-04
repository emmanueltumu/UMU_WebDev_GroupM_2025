document.getElementById("contactForm").addEventListener("submit", function (e) {
    const fields = ["firstName", "lastName", "email", "subject", "message"];
    for (let i of fields) {
        if (document.getElementById(i).value.trim() === "") {
            alert("Please fill in all fields.");
            e.preventDefault();
            return;
        }
    }

    alert("Message sent successfully!");
});
