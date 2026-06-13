def min_speed(dist, hour):

    def right_speed(k):
        temp = 0
        for i in dist:
            temp += i // k 
            if i % k != 0:
                temp += 1
        return temp <= hour
    
    left , right = 1 , max(dist)
    while left < right:
        mid = (left + right) // 2

        if right_speed(mid):
            right = mid
        else:
            left = mid + 1
    return right