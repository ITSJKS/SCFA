import math 
def min_speed(dist, hour):
    left, right = 1, 10**7
    ans = -1

    def reach(speed):
        time = 0
        for i in range(len(dist)):
            if i == len(dist)-1:
                time += dist[i]/speed
            else:
                time += math.ceil(dist[i]/speed)
        return time <= hour
    
    while left <= right:
        mid =(left+right) //2
        if reach(mid):
            ans = mid
            right = mid - 1
        else:
            left = mid + 1
    return ans