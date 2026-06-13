import math 

def check(dist, hour, mid):
    count = 0
    for i in dist:
        count += math.ceil(i/mid)
    if(count <= hour):
        return True
    return False
def min_speed(dist, hour):
    ans = -1
    s,e = 1, max(dist)
    while(s<=e):
        mid = s+(e-s)//2
        if(check(dist, hour, mid)):
            ans = mid
            e = mid-1
        else:
            s = mid+1
    return ans