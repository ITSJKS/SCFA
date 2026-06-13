def min_speed(dist, hour):
    def find(m):
        ans = 0
        for i in dist:
            ans += i // m
            if i % m != 0:
                ans += 1
        return ans
    
    l = 1
    h = max(dist)
    ans = h
    while l <= h:
        m = (l + h) // 2
        if find(m) <= hour:
            ans = m
            h = m - 1
        else:
            l = m + 1
    return ans