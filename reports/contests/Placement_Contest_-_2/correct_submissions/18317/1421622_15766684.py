import math
def check(mid, dist, hour):
    temp = 0
    count = 0
    z = 0
    if hour <= len(dist)-1:
        return False
    for i in dist:

        temp = math.ceil(i/mid)
        count += temp
        
        if (i == dist[len(dist)-1]):
            if (i%mid != 0):
                # print("i",i/mid)÷
                z = 1 - round(i/mid,2)
                count -= z
    # print(count)
    # print(count <= hour)
    return count <= hour

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