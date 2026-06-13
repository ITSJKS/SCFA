def min_speed(dist, hour):
    import math
    ans = -1
    def check(speed):
        h=0
        for i in range(len(dist)-1):
            a = math.ceil(dist[i]/speed)
            h += a
        h += dist[-1] / speed    
           
        return h<=hour    
             


    left,right = 1,10**7

    while left<=right:
        mid = (left+right)//2
        if check(mid):
            ans = mid
            right = mid-1
        else:
            left= mid+1
    return ans