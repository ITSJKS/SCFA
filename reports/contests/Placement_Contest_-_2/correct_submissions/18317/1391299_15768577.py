import math

def min_speed(dist, hour):
    mini = 1
    maxi = 10**7
    

    while mini <= maxi:
        mid = (mini + maxi) // 2

        if cando(dist, hour, mid):
           
            maxi = mid - 1
        else:
            mini = mid + 1

    return mini


def cando(dist, hour, speed):
    time = 0

    for i in range(len(dist)):
        
            time += math.ceil(dist[i] / speed)

    return time <= hour