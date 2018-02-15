import Game from "./src/Game";
import {World, Body, CollisionGroup, Rect, SquareBody, Vector, Friction} from "./src/Dynamica";
var g = new Game("white", "gameScreen" );
export default function game (){
   g.loop(30);
}