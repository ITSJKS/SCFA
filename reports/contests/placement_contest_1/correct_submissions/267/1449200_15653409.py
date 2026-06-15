def trap(arr):

    n = len(arr)
    left_max, right_max = [0] * n, [0] * n
    left_max[0] = arr[0]
    right_max[-1] = arr[-1]
    for i in range(1, n):
        left_max[i] = max(left_max[i - 1], arr[i])
    
    for i in range(n-2, -1, -1):
        right_max[i] = max(right_max[i+1], arr[i])

    # print(left_max)
    # print(right_max)
    res = 0
    for i in range(n):
        res += min(left_max[i], right_max[i]) - arr[i]
    return res