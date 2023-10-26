import { RopeFlow, selectRopeState } from "@/store/ropeSlice";
import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRopeState } from "@/store/ropeSlice";

export default function RopeMainController() {
    const dispatch = useDispatch();
    const ropeState = useSelector(selectRopeState);
    const btnStyle = useMemo(() => {
        switch (ropeState) {
            case RopeFlow.NONE:
                return {
                    width: '300px',
                    height: '300px',
                    lineHeight: '300px',
                    backgroundColor: "#6750A4",
                    color: "#fff",
                    transform: "translateY(100px)",
                    borderRadius: "50%",
                    overflow: "hidden",
                    textalign: "center",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "40px",
                }
            case RopeFlow.PENDING:
                return {
                    width: '120px',
                    height: '120px',
                    lineHeight: '120px',
                    backgroundColor: "#6750A4",
                    color: "#fff",
                    transform: "translateY(600px)",
                    borderRadius: "50%",
                    overflow: "hidden",
                    textalign: "center",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "30px",
                }
        }
    }, [ropeState]);
    const btnText = useMemo(() => {
        switch (ropeState) {
            case RopeFlow.NONE:
                return "开始跳绳";
            case RopeFlow.PENDING:
                return "结束";
        }
    }, [ropeState]);
    const handleClick = useCallback(() => {
        switch (ropeState) {
            case RopeFlow.NONE:
                dispatch(setRopeState(RopeFlow.PENDING));
                break;
            case RopeFlow.PENDING:
                dispatch(setRopeState(RopeFlow.NONE));
                break;
        }
    }, [ropeState]);
    return <div className=" transition-all" style={btnStyle} onClick={handleClick}>{btnText}</div>
}