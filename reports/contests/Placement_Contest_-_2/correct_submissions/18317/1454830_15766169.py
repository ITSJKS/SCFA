import math
def min_speed(dist, hour):
    low = 1
    high = max(dist)
    ans = 0
    while low <= high:
        time = 0
        mid = (low+high)//2
        for i in dist:
            time += math.ceil(i/mid)
        if time <= hour :
            ans = mid 
            
            high = mid -1
        else:
            low = mid +1

    return ans