import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { TokenWithBalance } from "../interfaces/tokens";
import { getTokensBalances } from "../utils/balances";

const useERC20Balances = (): [TokenWithBalance[], () => Promise<void>] => {
    const user = useUser();
    const [balances, setBalance] = useState<TokenWithBalance[]>([]);
    // console.log('balances', balances)

    const fetchUserErc20 = async () => {
        if (!user) {
            setBalance([]);
            return;
        }
        try {
            const tokensBalance = await getTokensBalances(user.provider);
            setBalance(tokensBalance);
        } catch (err) {
            setBalance([]);
        }
    };

    useEffect(() => {
        fetchUserErc20();
    }, [user?.provider]);
    return [balances, fetchUserErc20];
};

export default useERC20Balances;