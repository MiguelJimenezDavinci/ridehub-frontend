import { useEffect, useState } from "react";

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Activa la animación después de un pequeño retraso
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 100); // 100ms de retraso
    return () => clearTimeout(timeout);
  }, []);

  return (
    <footer
      className={`text-white py-2 fixed bottom-0 left-0 right-0 transform transition-transform duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="container mx-auto text-center text-sm">
        <nav className="mt-4 text-s">
          <a
            href="/landing"
            className="mx-3  text-white hover:text-gray-400 transition duration-300"
          >
            Acerca de Nosotros
          </a>
          <a
            href="/landing"
            className="mx-3 text-white hover:text-gray-400 transition duration-300"
          >
            Contacto
          </a>

          <a
            href="/landing"
            className="mx-3 text-white hover:text-gray-400 transition duration-300"
          >
            Política de Privacidad
          </a>
        </nav>
        <p className="text-text-xs mt-2 ">
          &copy; {new Date().getFullYear()} RideHub. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
