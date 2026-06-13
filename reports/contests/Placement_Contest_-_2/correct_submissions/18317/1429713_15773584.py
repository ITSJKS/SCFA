def min_speed(dist, hour):
    left = 1
    right = sum(dist)



    def check(dem):
        hours = 0
        for i in range (len(dist)-1):
            hours += (dist[i]+dem-1)//dem
        hours += (dist[-1])/dem #last element ka kyuki floor me answer chaiye sbke jese nhi wait krenge isme


        return hours<= hour

    ans = -1
    while left<=right:
        mid = (left+right)//2
        if check(mid):
            ans = mid
            right = mid -1
        else:
            left = mid + 1
    return ans