import AsyncStorage from "@react-native-async-storage/async-storage";

const getUserId = (): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        try {
            const userString = await AsyncStorage.getItem("healthTok_user");
            const user = userString ? JSON.parse(userString) : null;
            const id = user?.uid;

            if (id) {
                resolve(id);
            } else {
                reject("User ID is undefined");
            }
        } catch (error) {
            reject(error);
        }
    });
};

export default getUserId;
