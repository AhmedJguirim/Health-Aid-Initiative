const axios = require("axios").default;
const io = require("socket.io")(8081, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});
io.on("connection", (socket) => {
  console.log("call from" + socket.id);
  socket.on("join-rooms", (rooms) => {
    socket.join(rooms);
    console.log("sombody joined " + rooms);
  });
  socket.on("disconnect", () => console.log(socket.id + " got disconnected"));
  socket.on("Alert", (NotificationBody) => {
    axios
      .post("http://127.0.0.1:3001/api/notifications", NotificationBody)
      .then((response) => {
        console.log("notification created successfully");
        socket.to(NotificationBody.doctor).emit("NOTIFICATION", response.data);
      })
      .catch((err) => console.log(err));
  });

  socket.on("leave-room", (doctor_id) => {
    socket.leave(doctor_id);
    console.log(doctor_id + "left");
  });
});
