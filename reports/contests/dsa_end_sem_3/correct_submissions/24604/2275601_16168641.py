def findDifference(N, nums):
    es=0
    os=0
    for i in nums:
        if i%2==0:
            es+=i
        else:
            os+=i
    return (es-os)