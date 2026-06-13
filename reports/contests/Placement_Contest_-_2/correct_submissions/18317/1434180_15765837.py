import math
def min_speed(dist, hour):
    def check(num):
        ans = 0
        for i in dist:
            ans+= math.ceil(i/num)
        if ans<=hour:
            return True
        else:
            return False

    
    first = 1
    last = max(dist)
    while first<=last:
        mid = (first+last)//2
        if check(mid):
            last = mid-1
        else:
            first=mid+1
    
    return last+1