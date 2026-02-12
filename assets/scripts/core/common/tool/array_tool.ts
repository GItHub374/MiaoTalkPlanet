export class ArrayTool {

    /**
     * 
     * @param arr 数组去重
     * @returns 
     */
    static removeDuplicates<T>(arr: T[]): T[] {
        return [...new Set(arr)];
    }

    /**
     * 复制二维数组，注意这是浅拷贝
     * @param arr 二维数组
     * @returns 复制后的二维数组
     */ 
    static copy2DArray<T>(arr: T[][]): T[][] { 
        return arr.map(row => [...row]); 
    }

    /**
     * Fisher-Yates Shuffle 随机置乱算法
     * @param array 目标数组
     */
    static fisherYatesShuffle(array: any[]): any[] {
        let count = array.length;
        while (count) {
            let index = Math.floor(Math.random() * count--);
            let temp = array[count];
            array[count] = array[index];
            array[index] = temp;
        }
        return array;
    }

    /**
     * 打乱数组
     * @param array 目标数组
     */
    static confound(array: []): any[] {
        let result = array.slice().sort(() => Math.random() - .5);
        return result;
    }


    /**
     * 合并多个数组
     * @param arrays 多个数组
     * @returns 合并后的数组
     */ 
    static mergeArrays<T>(...arrays: T[][]): T[] { 
        return arrays.reduce((mergedArray, currentArray) => mergedArray.concat(currentArray), []); 
    }

    /**
     * 从数组中删除指定项
     * @param arr 目标数组
     * @param item 要删除的项
     * @param removeAll 是否删除所有匹配的项
     */
    static removeItem<T>(arr: T[], item: T, removeAll: boolean = false): T[] {
        if (removeAll) {
            return arr.filter(element => element !== item);
        } else {
            let index = arr.indexOf(item);
            if (index > -1) {
                arr.splice(index, 1);
            }
            return arr;
        }
    }

    /**
     * 反转数组
     * @param arr 目标数组
     *@returns 反转后的数组 
     */ 
    static reverseArray<T>(arr: T[]): T[] { return arr.reverse(); }

    /**
     * 数组求和
     * @param arr 
     * @returns 
     */
    static sumArrayElements(arr: number[]): number {
        return arr.reduce((sum, num) => sum + num, 0);
    }


    /** * 从数组中随机选出一个元素 
     * @param arr 目标数组 
     * @returns 随机选出的元素 
     */ 
    static getRandomElement<T>(arr: T[]): T { 
        const randomIndex = Math.floor(Math.random() * arr.length); 
        return arr[randomIndex]; 
    }


    /**
     * 划分数组
     * @param arr 目标数组
     * @returns 新的数组
     */
    static splitArray<T>(arr: T[], cnt : number = 2): T[][] {
        const pairs: T[][] = [];
        for (let i = 0; i < arr.length; i += cnt) {
            pairs.push(arr.slice(i, i + cnt));
        }
        return pairs;
    }


    /** * 获取一个元素在数组里面出现了多少次 
     * * @param arr 目标数组 
     * * @param item 要查找的元素 
     * * @returns 元素在数组中出现的次数 
     * 
     */ 
    static countOccurrences<T>(arr: T[], item: T): number { 
        return arr.filter(element => element === item).length; 
    }
}