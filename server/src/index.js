import { connectToMongoDB } from "./connections/mongoose";
import { runSocket } from "./connections/socket";
import { runExpress } from "./connections/express";

//Connects to mongoDB atlas
connectToMongoDB();
//Runs socket.io
runSocket();
//Runs express
runExpress();
