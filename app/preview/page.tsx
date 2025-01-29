"use client"
import STLViewer from "../upload/STLViewer";

export default function Preview() {
    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <STLViewer />
        </div>
    )
}