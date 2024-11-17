import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { Engine } from "tsparticles-engine";

const ParticleBackground = () => {
     const particlesInit = async (main: Engine): Promise<void> => {
          await loadFull(main);
     };


     return (
          <Particles
              
               id="tsparticles"
               init={particlesInit}
               options={{
                    autoPlay: true,
                    background: {
                         color: {
                              value: "#000000",
                         },
                         opacity: 1,
                    },
                    fullScreen: {
                         enable: true,
                         zIndex: -1,
                    },
                    detectRetina: true,
                    fpsLimit: 120,
                    interactivity: {
                         detectsOn: "window",
                         events: {
                              resize: {
                                   delay: 0.5,
                                   enable: true,
                              },
                         },
                    },
                    particles: {
                         color: {
                              value: "#fff",
                         },
                         move: {
                              direction: "right",
                              enable: true,
                              speed: 5,
                              outModes: {
                                   default: "out",
                              },
                         },
                         number: {
                              value: 200,
                         },
                         opacity: {
                              value: 1,
                         },
                         shape: {
                              type: "circle",
                         },
                         size: {
                              value: 3,
                         },
                    },
                    emitters: {
                         autoPlay: true,
                         fill: true,
                         rate: {
                              quantity: 1,
                              delay: 7,
                         },
                         shape: "square",
                         particles: {
                              shape: {
                                   type: "images",
                                   options: {
                                        images: {
                                             src: "https://particles.js.org/images/cyan_amongus.png",
                                             width: 500,
                                             height: 634,
                                        },
                                   },
                              },
                              size: {
                                   value: 40,
                              },
                              move: {
                                   speed: 10,
                                   outModes: {
                                        default: "none",
                                        right: "destroy",
                                   },
                                   straight: true,
                              },
                              rotate: {
                                   value: { min: 0, max: 360 },
                                   animation: {
                                        enable: true,
                                        speed: 10,
                                        sync: true,
                                   },
                              },
                         },
                         position: {
                              x: -5,
                              y: 55,
                         },
                    },
               }}
          />
     );
};

export default ParticleBackground;
