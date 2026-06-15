def trap(arr):
    n = len(arr)
    max_l_arr = [0]*n
    max_l_arr[0] = arr[0]
    for i in range(1,n):
        max_l_arr[i] = max(max_l_arr[i-1],arr[i])

    temp  = arr[::-1]
    max_r_arr = [0]*n
    max_r_arr[0] = arr[-1]
    for i in range(1,n):
        max_r_arr[i] = max(max_r_arr[i-1],temp[i])
    
    max_r_arr = max_r_arr[::-1]
    ans = 0
    for i in range(n):
        ans += abs(arr[i] - min(max_l_arr[i],max_r_arr[i]))
    
    return ans