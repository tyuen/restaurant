import ky from "ky";

export default ky.create({
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
  credentials: "include",
  throwHttpErrors: false,
});
