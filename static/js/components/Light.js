export default class Light {

    constructor(lightColor, position) {

        // przykładowe, nieobowiązkowe parametry konstruktora 
        // przekazane podczas tworzenia obiektu klasy Light
        // np scena, kolor światła, wielkość bryły

        this.lightColor = lightColor
        this.position = position

        //dodatkowe zmienne tworzone w konstruktorze
        //widoczne w dalszych funkcjach

        this.zmienna = 0

        //pusty kontener na inne obiekty 3D

        this.container = new THREE.Object3D();

        //wywołanie funkcji init()

        this.init()
    }

    init() {

        // utworzenie i pozycjonowanie światła

        this.light = new THREE.SpotLight(this.lightColor, 2, 500, Math.PI / 8);
        this.light.position.set(0, 0, 0); // ma być w pozycji 0,0,0 kontenera - nie zmieniamy 

        // dodanie światła do kontenera

        this.container.add(this.light);

        //utworzenie widzialnego elementu reprezentującego światło (mały sześcian, kula, czworościan foremny, do wyboru)
        var wireframe = new THREE.BoxGeometry(10, 10, 10);
        var material = new THREE.MeshBasicMaterial({
            color: 0x8888ff,
            side: THREE.DoubleSide,
            wireframe: true,
            transparent: true,
            opacity: 0.5
        });
        this.mesh = new THREE.Mesh(wireframe, material);

        // dodanie go do kontenera

        this.container.add(this.mesh);

        switch (this.position) {
            case "N": { this.container.position.set(100, 25, 0); break }
            case "E": { this.container.position.set(0, 25, 100); break }
            case "S": { this.container.position.set(-100, 25, 0); break }
            case "W": { this.container.position.set(0, 25, -100) }
        }

        let manage = $("<div>")
        manage.addClass("div")
        manage.css({ "height": "120px", "width": "168px", "border": "3px solid black", "background-color": "white" })
        let colors = $("<div>")
        colors.css({ "display": "flex", "width": "100%", "height": "36px" })
        let redColor = $("<div>")
        redColor.css({ "height": "28px", "width": "28px", "background-color": "red", "border": "3px solid black" })
        redColor.on("click", function () {
            this.changeColor(0xff0000)
        }.bind(this))
        let greenColor = $("<div>")
        greenColor.css({ "height": "28px", "width": "28px", "background-color": "green", "border": "3px solid black" })
        greenColor.on("click", function () {
            this.changeColor(0x00ff00)
        }.bind(this))
        let blueColor = $("<div>")
        blueColor.css({ "height": "28px", "width": "28px", "background-color": "blue", "border": "3px solid black" })
        blueColor.on("click", function () {
            this.changeColor(0x0000ff)
        }.bind(this))
        let yellowColor = $("<div>")
        yellowColor.css({ "height": "28px", "width": "28px", "background-color": "yellow", "border": "3px solid black" })
        yellowColor.on("click", function () {
            this.changeColor(0xffff00)
        }.bind(this))
        let magentaColor = $("<div>")
        magentaColor.css({ "height": "28px", "width": "28px", "background-color": "magenta", "border": "3px solid black" })
        magentaColor.on("click", function () {
            this.changeColor(0xff00ff)
        }.bind(this))
        let whiteColor = $("<div>")
        whiteColor.css({ "height": "28px", "width": "28px", "background-color": "white", "border": "3px solid black" })
        whiteColor.on("click", function () {
            this.changeColor(0xffffff)
        }.bind(this))
        colors.append(redColor)
        colors.append(greenColor)
        colors.append(blueColor)
        colors.append(yellowColor)
        colors.append(magentaColor)
        colors.append(whiteColor)
        manage.append(colors)

        let horizontalPos = $("<input>").attr({ "type": "range", "min": "-200", "max": "200" })
        horizontalPos.on("input", function (e) {
            this.changeHorizontalPosition(e.target.value, this.position)
        }.bind(this))

        let verticalPos = $("<input>").attr({ "type": "range", "min": "-25", "max": "200" })
        verticalPos.on("input", function (e) {
            this.changeVerticalPosition(e.target.value, this.position)
        }.bind(this))

        manage.append(horizontalPos)
        manage.append(verticalPos)

        $("#controls").append(manage)
    }


    // funkcja zwracająca obiekt kontenera
    // czyli nasze światło wraz z bryłą

    getLight() {
        return this.container;
    }

    // przykład innej funkcji, np do zmiany koloru bryły, zmiany koloru światła, etc

    changeColor(color) {
        this.container.children[0].color.set(color)
    }

    changeHorizontalPosition(newPos, axis) {
        this.container.children.forEach(function (object) {
            switch (axis) {
                case "N": { object.position.x = newPos; break }
                case "E": { object.position.z = newPos; break }
                case "S": { object.position.x = newPos; break }
                case "W": { object.position.z = newPos; }
            }
        }.bind(this))
    }

    changeVerticalPosition(newPos) {
        this.container.children.forEach(function (object) {
            object.position.y = newPos
        }.bind(this))
    }

}