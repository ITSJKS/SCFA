import math
def min_speed(dist, hour):
    left = 1
    right = max(dist)
    mini = right
    while (left<=right):
        mid = (left+right) // 2
        if piles(mid,dist,hour):
            mini = mid
            right = mid - 1
        else:
            left = mid + 1
    return mini
def piles(mid,dist,hour):
    count1 = 0
    for i in range(len(dist)):
        count1 += math.ceil(dist[i]/mid)
        if count1>hour:
            return False
    if count1>hour:
        return False
    return True