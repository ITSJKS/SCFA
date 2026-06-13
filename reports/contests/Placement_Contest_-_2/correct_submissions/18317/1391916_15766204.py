import math
def min_speed(dist, hour):

    arr = dist
    n = len(dist)
    if hour < len(dist):
        return -1
    left = 1
    right = max(dist)
    while left <= right:
        mid = (left + right) // 2
        sum1 = 0
        for i in range(n):
            sum1 += math.ceil(arr[i] / mid)
        if sum1 > hour:
            left = mid + 1
        else:
            right = mid - 1
    return left