def min_speed(dist, hour):
    def check(value, arr, hour):
        time = 0
        for i in range(0,len(arr)-1):
            if arr[i] % value == 0:
                time += arr[i] / value
            else:
                time += arr[i]//value
                time += 1
        last_e = arr[-1]
        time += last_e / value
        if time <= hour:
            return value
        else:
            return 0
    # for i in range(1,max(dist)+1):
    #     ans = check(i, dist, hour)
    #     if ans != 0:
    #         return ans
    #     else:
    #         continue
    # return -1
    s = 1
    e = max(dist)
    final_ans = -1
    while s <= e:
        mid = (s+e)//2
        ans = check(mid, dist, hour)
        if ans != 0:
            final_ans = ans
            e = mid - 1
        else:
            s = mid+1
    return final_ans