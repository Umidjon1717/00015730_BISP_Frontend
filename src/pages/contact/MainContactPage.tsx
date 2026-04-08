import Hero from "@/components/hero/Hero"
import Contact from "./Contact"
import Info from "@/components/info/Info"

const MainContactPage = () => {
  return (
    <>
        <Hero title="Contact" path="/contact" />
        <Contact/>
        <Info/>
    </>
  )
}

export default MainContactPage