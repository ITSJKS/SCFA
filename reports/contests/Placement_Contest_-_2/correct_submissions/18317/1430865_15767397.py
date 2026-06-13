import math

def helper(speed, dist, hour):
    total = 0

    # first n-1 trains (ceil)
    for i in range(len(dist) - 1):
        total += math.ceil(dist[i] / speed)

    # last train (no ceil)
    total += dist[-1] / speed

    return total <= hour


def min_speed(dist, hour):
    if len(dist) - 1 >= hour:
        return -1

    left = 1
    right = 10**7

    while left <= right:
        mid = (left + right) // 2

        if helper(mid, dist, hour):
            right = mid - 1
        else:
            left = mid + 1

    return left