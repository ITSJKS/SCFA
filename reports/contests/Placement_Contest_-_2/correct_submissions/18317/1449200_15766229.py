import math
def isPossibleToReach(dist, hour, atSpeed):
    timeTaken = 0.0
    for i in range(len(dist) - 1):
        cur = dist[i]
        timeTaken += math.ceil(cur/atSpeed)
    # print("before", timeTaken)
    timeTaken += (dist[-1] / atSpeed)
    # print("after", timeTaken)
    return hour >= timeTaken

def min_speed(dist, hour):
    minSpeed, maxSpeed = 1, max(dist)
    res = -1
    while minSpeed <= maxSpeed:
        midSpeed = minSpeed + ((maxSpeed - minSpeed) // 2)

        if isPossibleToReach(dist, hour, midSpeed):
            res = midSpeed
            maxSpeed = midSpeed - 1

        else:
            minSpeed = midSpeed + 1

    return res