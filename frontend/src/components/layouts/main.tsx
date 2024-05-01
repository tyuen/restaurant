import "./main.css";
import { useRef, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../header/Header";
import Footer from "../Footer";

const ANIM1 = {
  animation: "layout-anim1 0.3s ease-in-out",
};
const ANIM2 = {
  animation: "layout-anim2 0.3s ease-in-out",
};

export default function Layout() {
  const path = useLocation().pathname;
  const oldPath = useRef(path);

  const animClass = useRef(ANIM1);

  if (oldPath.current !== path) {
    oldPath.current = path;
    animClass.current = animClass.current === ANIM1 ? ANIM2 : ANIM1;
  }

  useEffect(() => {
    document.scrollingElement!.scrollTop = 0;
  }, [path]);

  return (
    <>
      <div
        className="flex flex-col items-stretch grow origin-top"
        style={animClass.current}
      >
        <Header />
        <Outlet />
        <Footer />
      </div>
    </>
  );
}
