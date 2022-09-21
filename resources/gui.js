const objeto1 = {
  animate: true,
  speed : 3,
  cameraPosX: 4,
  cameraPosY: 3.5,
  cameraPosZ: 10
};




const loadGUI = () => {
  const gui = new dat.GUI();
  gui.add(objeto1, "animate");
  gui.add(objeto1,"speed", 0, 6, 0.1);
  gui.add(objeto1, "cameraPosX",-30, 30,0.1);
  gui.add(objeto1,"cameraPosY",-30, 30, 0.1);
  gui.add(objeto1,"cameraPosZ",-30,30,0.1);
};


