async function upload() {
  let mode = document.getElementById("mode").value;

  let body = {
    bio: document.getElementById("bio").value
  };

  if (mode === "eat") {
    body.eat = document.getElementById("eat").value;
  } else {
    body.uid = document.getElementById("uid").value;
    body.pass = document.getElementById("pass").value;
  }

  let res = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  let data = await res.json();
  document.getElementById("msg").innerText = JSON.stringify(data);
}