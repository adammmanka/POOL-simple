import { useEffect, useState } from "react";
import { BigNumber } from "ethers";
import { useUser } from "../context/UserContext";
import { getETHBalance } from "../utils/balances";

const useETHBalance = (): [BigNumber, () => Promise<void>] => {
    const user = useUser();
    const [balance, setBalance] = useState<BigNumber>(BigNumber.from("0"));

    const fetchUserETH = async () => {
        if (!user) {
            setBalance(BigNumber.from("0"));

            return;
        }
        try {
            const ethBalance = await getETHBalance(user.provider);
            setBalance(ethBalance);
        } catch (err) {
            setBalance(BigNumber.from("0"));
        }
    };

    useEffect(() => {
        fetchUserETH();
    }, [user?.provider]);
    // console.log('useETHBalances-balance', balance)
    return [balance, fetchUserETH];
};

export default useETHBalance;