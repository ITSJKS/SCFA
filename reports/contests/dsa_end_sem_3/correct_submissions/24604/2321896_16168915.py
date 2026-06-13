def findDifference(N, nums):
    even = 0
    odd = 0
    for i in nums:
        if i%2 == 0:
            even += int(i)
        else:
            odd += int(i) 
    return even-odd