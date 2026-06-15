def trap(arr):

    n = len(arr)
    prefix_max = [-1] * n
    suffix_max = [-1] * n
    water = 0

    prefix_max[0] = arr[0]

    for i in range(1, n):
            prefix_max[i] = max(prefix_max[i-1], arr[i]) 
    suffix_max[-1] = arr[-1]

    for i in range(n-2,-1,-1):
        suffix_max[i] = max(suffix_max[i+1] , arr[i])


    for i in range(n):
        leftMax = prefix_max[i] 
        rightMax = suffix_max[i]

        if arr[i] < leftMax and arr[i] < rightMax:
            water += min(leftMax, rightMax) - arr[i]


    return water