def min_speed(dist, hour):    
    s = 1
    e = max(dist)

    while s <= e:
        mid = (s + e) // 2

        hours = 0

        for elem in dist:
            hours += elem // mid
            if elem % mid != 0:
                hours += 1

        if hours <= hour:
            ans = mid 
            e = mid - 1
        else:
            s = mid + 1

    return ans