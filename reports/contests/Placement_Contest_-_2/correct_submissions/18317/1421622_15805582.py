import math
def check(mid, dist, hour):
    temp = 0

    
    for i in range(len(dist)-1):

        temp += math.ceil(dist[i]/mid)
        
    temp += dist[-1]/mid
    return temp <= hour

def min_speed(dist, hour):
    s = 1
    e = max(dist)
    ans = -1
    while(s <= e):
        mid = s + (e-s)//2
        if check(mid, dist, hour):
            ans = mid
            e = mid -1
        else:
            s = mid + 1
    return ans